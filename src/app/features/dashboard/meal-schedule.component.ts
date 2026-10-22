import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DashboardApiService } from '../../core/dashboard-api.service';
import { GamificationService } from '../../core/gamification.service';
import { toAbsoluteImageUrl } from '../../core/image-url';
import { MEAL_SLOT_LABELS, ReplacementSuggestion, Schedule, ScheduleDay, ScheduledMeal } from '../../core/models';
import { NotificationService } from '../../core/notification.service';
import { ScheduleApiService } from '../../core/schedule-api.service';

const PREVIEW_DAYS = 7;
const REMINDER_STORAGE_KEY = 'mealSchedule.lastReminderDate';

type Panel = { key: string; type: 'swap' | 'replace' };

@Component({
  selector: 'app-meal-schedule',
  templateUrl: './meal-schedule.component.html',
  styleUrls: ['./meal-schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class MealScheduleComponent implements OnInit {
  @Output() readonly changed = new EventEmitter<void>();

  readonly slotLabels = MEAL_SLOT_LABELS;
  schedule: Schedule | null = null;
  loading = true;
  errorMessage = '';
  successMessage = '';
  busyKey: string | null = null;
  generatingList = false;
  panel: Panel | null = null;
  suggestions: ReplacementSuggestion[] = [];
  suggestionsLoading = false;

  constructor(
    private readonly scheduleApi: ScheduleApiService,
    private readonly dashboardApi: DashboardApiService,
    private readonly gamification: GamificationService,
    private readonly notifications: NotificationService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  get focusDays(): ScheduleDay[] {
    return this.schedule?.days.slice(0, 2) ?? [];
  }

  get laterDays(): ScheduleDay[] {
    return this.schedule?.days.slice(2).filter((day) => day.meals.length > 0) ?? [];
  }

  get hasMeals(): boolean {
    return this.schedule?.days.some((day) => day.meals.length > 0) ?? false;
  }

  load(): void {
    this.scheduleApi.getSchedule(PREVIEW_DAYS).subscribe({
      next: (schedule) => {
        this.schedule = schedule;
        this.loading = false;
        this.remindOncePerDay(schedule);
      },
      error: () => {
        this.errorMessage = 'Die nächsten Gerichte konnten nicht geladen werden.';
        this.loading = false;
      },
    });
  }

  dayLabel(day: ScheduleDay): string {
    switch (day.dayOffset) {
      case 0:
        return 'Heute';
      case 1:
        return 'Morgen';
      case 2:
        return 'Übermorgen';
      default:
        return `In ${day.dayOffset} Tagen`;
    }
  }

  mealKey(meal: ScheduledMeal, index: number): string {
    return `${meal.dayOffset}-${meal.mealSlot}-${index}`;
  }

  imageUrl(path: string): string {
    return toAbsoluteImageUrl(path);
  }

  missingNames(meal: ScheduledMeal): string {
    return meal.missingIngredients
      .filter((ingredient) => ingredient.uncoveredQuantity > 0)
      .map((ingredient) => ingredient.ingredientName)
      .join(', ');
  }

  statusSymbol(meal: ScheduledMeal): string {
    switch (meal.ingredientStatus) {
      case 'AVAILABLE':
        return '✓';
      case 'ON_LIST':
        return '≡';
      case 'MISSING':
        return '!';
      default:
        return '·';
    }
  }

  statusLabel(meal: ScheduledMeal): string {
    switch (meal.ingredientStatus) {
      case 'AVAILABLE':
        return 'Alles da';
      case 'ON_LIST':
        return 'Auf der Einkaufsliste';
      case 'MISSING':
        return `Fehlt: ${this.missingNames(meal)}`;
      default:
        return 'Keine Zutaten hinterlegt';
    }
  }

  swapOptions(meal: ScheduledMeal): ScheduledMeal[] {
    const seen = new Set<number>([meal.planEntryId ?? -1]);
    const options: ScheduledMeal[] = [];
    for (const day of this.schedule?.days ?? []) {
      for (const candidate of day.meals) {
        if (candidate.status === 'PLANNED' && candidate.planEntryId !== null && !seen.has(candidate.planEntryId)) {
          seen.add(candidate.planEntryId);
          options.push(candidate);
        }
      }
    }
    return options;
  }

  optionLabel(option: ScheduledMeal): string {
    const day = this.schedule?.days[option.dayOffset];
    return `${day ? this.dayLabel(day) : ''} · ${this.slotLabels[option.mealSlot]}: ${option.dishName}`;
  }

  togglePanel(key: string, type: Panel['type'], meal: ScheduledMeal): void {
    if (this.panel?.key === key && this.panel.type === type) {
      this.panel = null;
      return;
    }
    this.panel = { key, type };
    if (type === 'replace' && meal.planEntryId !== null) {
      this.suggestions = [];
      this.suggestionsLoading = true;
      this.scheduleApi.getReplacementSuggestions(meal.planEntryId).subscribe({
        next: (suggestions) => {
          this.suggestions = suggestions;
          this.suggestionsLoading = false;
        },
        error: () => {
          this.suggestionsLoading = false;
          this.errorMessage = 'Es konnten keine Ersatzgerichte geladen werden.';
        },
      });
    }
  }

  cook(meal: ScheduledMeal, key: string): void {
    if (meal.planEntryId === null) {
      return;
    }
    this.run(key, this.dashboardApi.markCooked(meal.planEntryId), `${meal.dishName} ist als gekocht gespeichert.`, () =>
      void this.gamification.record('COOK_DISH', String(meal.dishId)),
    );
  }

  skip(meal: ScheduledMeal, key: string): void {
    if (meal.planEntryId !== null) {
      this.run(key, this.scheduleApi.skip(meal.planEntryId), `${meal.dishName} wurde nach hinten verschoben.`);
    }
  }

  swap(meal: ScheduledMeal, key: string, otherEntryId: string): void {
    if (meal.planEntryId !== null && otherEntryId) {
      this.run(key, this.scheduleApi.swap(meal.planEntryId, Number(otherEntryId)), 'Gerichte wurden getauscht.');
    }
  }

  replace(meal: ScheduledMeal, key: string, suggestion: ReplacementSuggestion): void {
    if (meal.planEntryId !== null) {
      this.run(
        key,
        this.scheduleApi.replaceDish(meal.planEntryId, suggestion.dishId),
        `${meal.dishName} wurde durch ${suggestion.name} ersetzt.`,
      );
    }
  }

  addMissing(meal: ScheduledMeal, key: string): void {
    if (meal.planEntryId !== null) {
      this.run(
        key,
        this.scheduleApi.addMissingToShoppingList(meal.planEntryId),
        `Fehlende Zutaten für ${meal.dishName} stehen auf der Einkaufsliste.`,
      );
    }
  }

  generateShoppingList(): void {
    if (this.generatingList) {
      return;
    }
    this.generatingList = true;
    this.errorMessage = '';
    this.scheduleApi.generateUpcomingShoppingList().subscribe({
      next: () => {
        this.generatingList = false;
        void this.router.navigate(['/shopping-list']);
      },
      error: () => {
        this.generatingList = false;
        this.errorMessage = 'Die Einkaufsliste konnte nicht erstellt werden.';
      },
    });
  }

  private run(key: string, request: Observable<unknown>, success: string, afterSuccess?: () => void): void {
    if (this.busyKey) {
      return;
    }
    this.busyKey = key;
    this.errorMessage = '';
    this.successMessage = '';
    request.subscribe({
      next: () => {
        afterSuccess?.();
        this.busyKey = null;
        this.panel = null;
        this.successMessage = success;
        this.load();
        this.changed.emit();
      },
      error: () => {
        this.busyKey = null;
        this.errorMessage = 'Die Änderung konnte nicht gespeichert werden.';
      },
    });
  }

  // Real push needs VAPID/APNs credentials (see ki-anleitungen/07); until then remind in-app once per day.
  private remindOncePerDay(schedule: Schedule): void {
    const todayKey = schedule.days[0]?.date;
    if (!todayKey || localStorage.getItem(REMINDER_STORAGE_KEY) === todayKey) {
      return;
    }
    const upcoming = schedule.days.slice(0, 2).flatMap((day) => day.meals).filter((meal) => meal.status === 'PLANNED');
    const tomorrowPrep = (schedule.days[1]?.meals ?? []).filter((meal) => meal.status === 'PLANNED' && meal.advancePrepNote);
    const missing = upcoming.filter((meal) => meal.ingredientStatus === 'MISSING');
    const hints: string[] = [];
    if (tomorrowPrep.length > 0) {
      hints.push(`Für morgen vorbereiten: ${tomorrowPrep.map((meal) => meal.advancePrepNote).join('; ')}`);
    }
    if (missing.length > 0) {
      hints.push(`Für ${missing.map((meal) => meal.dishName).join(', ')} fehlen noch Zutaten.`);
    }
    if (hints.length === 0) {
      return;
    }
    localStorage.setItem(REMINDER_STORAGE_KEY, todayKey);
    this.notifications.show(hints.join(' '), 'info', 8000);
  }
}
