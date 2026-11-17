import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { DishApiService } from '../../core/dish-api.service';
import { toAbsoluteImageUrl } from '../../core/image-url';
import { UseSoon, UseSoonDish, UseSoonItem } from '../../core/models';
import { RecommendationApiService } from '../../core/recommendation-api.service';
import { ScheduleApiService } from '../../core/schedule-api.service';
import { expiryInfo } from './expiry';

/**
 * Expiring stock with dishes that use it up, ranked by urgency, pantry coverage and taste. Shown on
 * "Heute" and in the pantry; every suggestion can be acted on right here.
 */
@Component({
  selector: 'app-use-soon-card',
  templateUrl: './use-soon-card.component.html',
  styleUrls: ['./use-soon-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterLink],
})
export class UseSoonCardComponent {
  @Input() useSoon: UseSoon | null = null;
  /** Number of suggestions to show. */
  @Input() limit = 4;
  /** Emitted after an action changed plan, shopping list or suggestions. */
  @Output() readonly changed = new EventEmitter<void>();

  busyDishId: number | null = null;
  message = '';
  errorMessage = '';
  private readonly hiddenDishIds = new Set<number>();

  constructor(
    private readonly scheduleApi: ScheduleApiService,
    private readonly dishApi: DishApiService,
    private readonly recommendationApi: RecommendationApiService,
  ) {}

  get dishes(): UseSoonDish[] {
    return (this.useSoon?.dishes ?? []).filter((dish) => !this.hiddenDishIds.has(dish.id)).slice(0, this.limit);
  }

  get allPlanned(): boolean {
    return !!this.useSoon?.items.length && this.useSoon.items.every((item) => item.planned);
  }

  imageUrl(path: string): string {
    return toAbsoluteImageUrl(path);
  }

  expiryLabel(item: UseSoonItem): string {
    return expiryInfo(item.expiresOn)?.label ?? '';
  }

  isExpired(item: UseSoonItem): boolean {
    return expiryInfo(item.expiresOn)?.level === 'expired';
  }

  /** Why this dish is suggested, e.g. "verbraucht Hähnchen + Sahne · 1 Zutat fehlt". */
  reason(dish: UseSoonDish): string {
    const parts = [`verbraucht ${dish.matchedIngredients.join(' + ')}`];
    parts.push(
      dish.missingCount === 0
        ? 'alles da'
        : `${dish.missingCount} ${dish.missingCount === 1 ? 'Zutat fehlt' : 'Zutaten fehlen'}`,
    );
    if (dish.liked) {
      parts.push('passt zu deinem Geschmack');
    }
    return parts.join(' · ');
  }

  /** "Heute", "Morgen" or the next open day of the plan. */
  get planDay(): string {
    switch (this.useSoon?.todayEntry?.dayOffset) {
      case 0:
        return 'Heute';
      case 1:
        return 'Morgen';
      default:
        return 'Als Nächstes';
    }
  }

  planToday(dish: UseSoonDish): void {
    const target = this.useSoon?.todayEntry;
    if (!target || this.busyDishId !== null) {
      return;
    }
    this.run(
      dish,
      this.scheduleApi.replaceDish(target.planEntryId, dish.id),
      `${dish.name} ersetzt ${this.planDay.toLowerCase()} ${target.dishName}.`,
    );
  }

  addMissing(dish: UseSoonDish): void {
    if (this.busyDishId === null) {
      this.run(
        dish,
        this.dishApi.addMissingToShoppingList(dish.id),
        `Fehlende Zutaten für ${dish.name} stehen auf der Einkaufsliste.`,
      );
    }
  }

  lessOf(dish: UseSoonDish): void {
    // Gone at once; the server remembers it for all future suggestions.
    this.hiddenDishIds.add(dish.id);
    this.message = `${dish.name} wird nicht mehr vorgeschlagen.`;
    this.errorMessage = '';
    this.recommendationApi.lessOf(dish.id).subscribe({
      next: () => this.changed.emit(),
      error: () => {
        this.hiddenDishIds.delete(dish.id);
        this.message = '';
        this.errorMessage = 'Das konnte nicht gespeichert werden.';
      },
    });
  }

  private run(dish: UseSoonDish, request: Observable<unknown>, success: string): void {
    this.busyDishId = dish.id;
    this.message = '';
    this.errorMessage = '';
    request.subscribe({
      next: () => {
        this.busyDishId = null;
        this.message = success;
        this.changed.emit();
      },
      error: () => {
        this.busyDishId = null;
        this.errorMessage = 'Die Änderung konnte nicht gespeichert werden.';
      },
    });
  }
}
