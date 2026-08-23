import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreatorDetail, CreatorSummary, Dish, MealPlan } from './models';

@Injectable({ providedIn: 'root' })
export class CreatorApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getCreators(): Observable<CreatorSummary[]> {
    return this.http.get<CreatorSummary[]>(`${this.apiUrl}/creators`);
  }

  getCreator(creatorId: number): Observable<CreatorDetail> {
    return this.http.get<CreatorDetail>(`${this.apiUrl}/creators/${creatorId}`);
  }

  getPlanDishes(creatorId: number, planId: number): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${this.apiUrl}/creators/${creatorId}/plans/${planId}/dishes`);
  }

  copyPlan(creatorId: number, planId: number): Observable<MealPlan> {
    return this.http.post<MealPlan>(`${this.apiUrl}/creators/${creatorId}/plans/${planId}/copy`, {});
  }
}