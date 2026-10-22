import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DashboardApiService } from '../../core/dashboard-api.service';
import { DashboardData, Recommendations } from '../../core/models';
import { toAbsoluteImageUrl } from '../../core/image-url';
import { RecommendationApiService } from '../../core/recommendation-api.service';
import { MealScheduleComponent } from './meal-schedule.component';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MealScheduleComponent, RouterLink, DecimalPipe]
})
export class DashboardComponent implements OnInit {
  dashboard: DashboardData | null = null;
  loading = true;
  errorMessage = '';
  recommendations: Recommendations | null = null;
  readonly todayLabel = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })
    .format(new Date());

  constructor(
    readonly dashboardApi: DashboardApiService,
    private readonly recommendationApi: RecommendationApiService,
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
    this.load();
    this.recommendationApi.getRecommendations().subscribe({
      next: (recommendations) => (this.recommendations = recommendations),
      error: () => (this.recommendations = null),
    });
  }

  load(): void {
    this.dashboardApi.getDashboard().subscribe({
      next: (dashboard) => {
        this.dashboard = dashboard;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Die Übersicht konnte nicht geladen werden. Ist das Backend gestartet?';
        this.loading = false;
      },
    });
  }
}
