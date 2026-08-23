import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DashboardApiService } from '../../core/dashboard-api.service';
import { DashboardData } from '../../core/models';
import { toAbsoluteImageUrl } from '../../core/image-url';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DashboardComponent implements OnInit {
  dashboard: DashboardData | null = null;
  loading = true;
  errorMessage = '';
  cooking = false;

  constructor(readonly dashboardApi: DashboardApiService) {}

  imageUrl(path: string): string {
    return toAbsoluteImageUrl(path);
  }

  displayInteger(value: number): string {
    return Math.trunc(value).toString();
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
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

  markCooked(): void {
    if (!this.dashboard?.nextDish || this.cooking) {
      return;
    }

    this.cooking = true;
    this.dashboardApi.markCooked(this.dashboard.nextDish.planEntryId).subscribe({
      next: (dashboard) => {
        this.dashboard = dashboard;
        this.cooking = false;
      },
      error: () => {
        this.errorMessage = 'Das Gericht konnte nicht als gekocht markiert werden.';
        this.cooking = false;
      },
    });
  }
}
