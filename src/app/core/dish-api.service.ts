import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DishCatalogEntry, DishDetail, DishIngredientEntry, DishRatingSummary, Ingredient, PrepStep } from './models';
import { toAbsoluteImageUrl } from './image-url';

@Injectable({ providedIn: 'root' })
export class DishApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  search(search: string, tag: string, favoritesOnly = false): Observable<DishCatalogEntry[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    if (tag) {
      params = params.set('tag', tag);
    }
    if (favoritesOnly) {
      params = params.set('favorites', true);
    }
    return this.http.get<DishCatalogEntry[]>(`${this.apiUrl}/dishes`, { params });
  }

  getDish(dishId: number): Observable<DishDetail> {
    return this.http.get<DishDetail>(`${this.apiUrl}/dishes/${dishId}`);
  }

  rateDish(dishId: number, stars: number): Observable<DishRatingSummary> {
    return this.http.post<DishRatingSummary>(`${this.apiUrl}/dishes/${dishId}/ratings`, { stars });
  }

  setFavorite(dishId: number, favorite: boolean): Observable<{ favorite: boolean }> {
    return this.http.put<{ favorite: boolean }>(`${this.apiUrl}/dishes/${dishId}/favorite`, { favorite });
  }

  addImage(dishId: number, image: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/dishes/${dishId}/images`, formData);
  }

  addStep(dishId: number, text: string, timerSeconds: number | null): Observable<PrepStep> {
    return this.http.post<PrepStep>(`${this.apiUrl}/dishes/${dishId}/steps`, { text, timerSeconds });
  }

  addIngredient(dishId: number, ingredientId: number, quantityGrams: number): Observable<DishIngredientEntry> {
    return this.http.post<DishIngredientEntry>(`${this.apiUrl}/dishes/${dishId}/ingredients`, {
      ingredientId,
      quantityGrams,
    });
  }

  getIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(`${this.apiUrl}/ingredients`);
  }

  createIngredient(
    name: string,
    kcalPer100: number,
    proteinPer100: number,
    unit: string,
  ): Observable<Ingredient> {
    return this.http.post<Ingredient>(`${this.apiUrl}/ingredients`, { name, kcalPer100, proteinPer100, unit });
  }

  imageUrl(path: string): string {
    return toAbsoluteImageUrl(path);
  }
}
