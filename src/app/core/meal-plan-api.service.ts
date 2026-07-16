import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Dish, MealPlan } from './models';

@Injectable({ providedIn: 'root' })
export class MealPlanApiService {
  private readonly apiUrl = environment.apiUrl;
  private readonly backendUrl = this.apiUrl.replace(/\/api$/, '');

  constructor(private readonly http: HttpClient) {}

  getPlans(): Observable<MealPlan[]> {
    return this.http.get<MealPlan[]>(`${this.apiUrl}/plans`);
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
    return path.startsWith('http') ? path : `${this.backendUrl}${path}`;
  }
}