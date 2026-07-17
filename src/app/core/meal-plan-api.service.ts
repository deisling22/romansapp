import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Dish, MealPlan } from './models';
import { toAbsoluteImageUrl } from './image-url';

@Injectable({ providedIn: 'root' })
export class MealPlanApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getPlans(): Observable<MealPlan[]> {
    return this.http.get<MealPlan[]>(`${this.apiUrl}/plans`);
  }

  createPlan(name: string): Observable<MealPlan> {
    return this.http.post<MealPlan>(`${this.apiUrl}/plans`, { name });
  }

  deletePlan(planId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/plans/${planId}`);
  }

  copyPlan(planId: number): Observable<MealPlan> {
    return this.http.post<MealPlan>(`${this.apiUrl}/plans/${planId}/copy`, {});
  }

  getDishes(planId: number): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${this.apiUrl}/plans/${planId}/dishes`);
  }

  createDish(planId: number, name: string, image: File): Observable<Dish> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);

    return this.http.post<Dish>(`${this.apiUrl}/plans/${planId}/dishes`, formData);
  }

  imageUrl(path: string): string {
    return toAbsoluteImageUrl(path);
  }
}
