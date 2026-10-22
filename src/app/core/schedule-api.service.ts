import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MealPlan, MealSlot, ReplacementSuggestion, Schedule, ShoppingListItem, StapleItem } from './models';

@Injectable({ providedIn: 'root' })
export class ScheduleApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getSchedule(days = 7): Observable<Schedule> {
    return this.http.get<Schedule>(`${this.apiUrl}/schedule`, { params: new HttpParams().set('days', days) });
  }

  generateUpcomingShoppingList(days?: number): Observable<ShoppingListItem[]> {
    const params = days ? new HttpParams().set('days', days) : undefined;
    return this.http.post<ShoppingListItem[]>(`${this.apiUrl}/schedule/shopping-list`, {}, { params });
  }

  swap(planEntryId: number, otherEntryId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/plan-entries/${planEntryId}/swap`, { otherEntryId });
  }

  skip(planEntryId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/plan-entries/${planEntryId}/skip`, {});
  }

  replaceDish(planEntryId: number, dishId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/plan-entries/${planEntryId}/dish`, { dishId });
  }

  setMealSlot(planEntryId: number, mealSlot: MealSlot): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/plan-entries/${planEntryId}/meal-slot`, { mealSlot });
  }

  getReplacementSuggestions(planEntryId: number): Observable<ReplacementSuggestion[]> {
    return this.http.get<ReplacementSuggestion[]>(`${this.apiUrl}/plan-entries/${planEntryId}/replacement-suggestions`);
  }

  addMissingToShoppingList(planEntryId: number): Observable<ShoppingListItem[]> {
    return this.http.post<ShoppingListItem[]>(`${this.apiUrl}/plan-entries/${planEntryId}/missing-to-shopping-list`, {});
  }

  updatePlanSettings(planId: number, settings: { active?: boolean; leftoversForLunch?: boolean }): Observable<MealPlan> {
    return this.http.put<MealPlan>(`${this.apiUrl}/plans/${planId}/settings`, settings);
  }

  getStaples(): Observable<StapleItem[]> {
    return this.http.get<StapleItem[]>(`${this.apiUrl}/staples`);
  }

  addStaple(ingredientName: string, quantity: number, unit: string): Observable<StapleItem> {
    return this.http.post<StapleItem>(`${this.apiUrl}/staples`, { ingredientName, quantity, unit });
  }

  deleteStaple(stapleId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/staples/${stapleId}`);
  }
}
