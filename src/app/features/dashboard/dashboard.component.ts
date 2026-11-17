import { Component, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DashboardApiService } from '../../core/dashboard-api.service';
import { DashboardData, DishCatalogEntry, Home, Recommendations, Schedule, UseSoon, WeekNutrition } from '../../core/models';
import { toAbsoluteImageUrl } from '../../core/image-url';
import { OnboardingService } from '../../core/onboarding.service';
import { RecommendationApiService } from '../../core/recommendation-api.service';
import { ShoppingListOutboxService } from '../../core/shopping-list-outbox.service';
import { SnapshotCacheService } from '../../core/snapshot-cache.service';
import { UseSoonCardComponent } from '../pantry/use-soon-card.component';
import { MealScheduleComponent } from './meal-schedule.component';
import { WeekNutritionComponent } from './week-nutrition.component';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';

const HOME_SNAPSHOT = 'home';
const RECOMMENDATIONS_SNAPSHOT = 'recommendations';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MealScheduleComponent, WeekNutritionComponent, UseSoonCardComponent, RouterLink, DecimalPipe]
})
export class DashboardComponent implements OnInit {
  dashboard: DashboardData | null = null;
  schedule: Schedule | null = null;
  useSoon: UseSoon | null = null;
  week: WeekNutrition | null = null;
  recommendations: Recommendations | null = null;
  loading = true;
  /** A request is on its way while older content is already on screen. */
  refreshing = false;
  errorMessage = '';
  readonly todayLabel = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })
    .format(new Date());

  private requestId = 0;

  constructor(
    readonly dashboardApi: DashboardApiService,
    private readonly recommendationApi: RecommendationApiService,
    private readonly snapshots: SnapshotCacheService,
    private readonly onboarding: OnboardingService,
    private readonly outbox: ShoppingListOutboxService,
    private readonly destroyRef: DestroyRef,
  ) {}

  imageUrl(path: string): string {
    return toAbsoluteImageUrl(path);
  }

  displayInteger(value: number): string {
    return Math.trunc(value).toString();
  }

  ringPercent(percent: number | null): number {
    return Math.max(0, Math.min(100, percent ?? 0));
  }

  ngOnInit(): void {
    // Last known state first: a sleeping backend can take minutes to answer.
    const snapshot = this.snapshots.read<Home>(HOME_SNAPSHOT);
    if (snapshot?.schedule?.days[0]?.date === todayIso()) {
      this.apply(snapshot);
    }
    this.recommendations = this.snapshots.read<Recommendations>(RECOMMENDATIONS_SNAPSHOT);
    this.load();
    this.loadRecommendations();
    // A purchase that finishes after the user came back here changes what is "alles da".
    this.outbox.booked$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.load());
    this.onboarding.completed$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.load();
      this.loadRecommendations();
    });
  }

  /** One request delivers plan, figures and "use soon"; every change on this screen ends here. */
  load(): void {
    const requestId = ++this.requestId;
    this.refreshing = true;
    this.dashboardApi.getHome().subscribe({
      next: (home) => {
        // Only the newest answer counts when several changes were made in a row.
        if (requestId !== this.requestId) {
          return;
        }
        this.refreshing = false;
        this.errorMessage = '';
        this.apply(home);
        this.snapshots.write(HOME_SNAPSHOT, home);
      },
      error: () => {
        if (requestId !== this.requestId) {
          return;
        }
        this.refreshing = false;
        this.loading = false;
        if (!this.dashboard) {
          this.errorMessage = 'Die Übersicht konnte nicht geladen werden. Bitte später erneut versuchen.';
        }
      },
    });
  }

  /** Some actions answer with the fresh screen state; then no extra request is needed. */
  onScheduleChanged(home: Home | undefined): void {
    if (!home) {
      this.load();
      return;
    }
    // Invalidates answers of older requests that are still on their way.
    this.requestId++;
    this.refreshing = false;
    this.apply(home);
    this.snapshots.write(HOME_SNAPSHOT, home);
  }

  lessOf(dish: DishCatalogEntry, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.recommendations) {
      return;
    }
    const previous = this.recommendations;
    this.recommendations = { ...previous, dishes: previous.dishes.filter((entry) => entry.id !== dish.id) };
    this.recommendationApi.lessOf(dish.id).subscribe({
      next: () => this.snapshots.write(RECOMMENDATIONS_SNAPSHOT, this.recommendations),
      error: () => (this.recommendations = previous),
    });
  }

  private apply(home: Home): void {
    this.dashboard = home.dashboard;
    this.schedule = home.schedule;
    this.useSoon = home.useSoon;
    this.week = home.week;
    this.loading = false;
  }

  private loadRecommendations(): void {
    this.recommendationApi.getRecommendations().subscribe({
      next: (recommendations) => {
        this.recommendations = recommendations;
        this.snapshots.write(RECOMMENDATIONS_SNAPSHOT, recommendations);
      },
      error: () => undefined,
    });
  }
}

function todayIso(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
