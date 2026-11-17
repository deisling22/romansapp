import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DashboardData, Home, WeekNutrition } from './models';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  /** Plan, figures and "use soon" in one round trip. */
  getHome(days = 7): Observable<Home> {
    return this.http.get<Home>(`${this.apiUrl}/home`, { params: { days } });
  }

  getDashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/dashboard`);
  }

  getWeek(): Observable<WeekNutrition> {
    return this.http.get<WeekNutrition>(`${this.apiUrl}/dashboard/week`);
  }

  markCooked(planEntryId: number): Observable<DashboardData> {
    return this.http.patch<DashboardData>(`${this.apiUrl}/plan-entries/${planEntryId}/cook`, {});
  }
}
