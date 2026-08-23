import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PantryItem, ShoppingListItem } from './models';

@Injectable({ providedIn: 'root' })
export class ShoppingListApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getItems(planId: number): Observable<ShoppingListItem[]> {
    return this.http.get<ShoppingListItem[]>(`${this.apiUrl}/plans/${planId}/shopping-list`);
  }

  getAllItems(): Observable<ShoppingListItem[]> {
    return this.http.get<ShoppingListItem[]>(`${this.apiUrl}/shopping-list`);
  }

  addItem(ingredientName: string, quantity: number, unit: string): Observable<ShoppingListItem> {
    return this.http.post<ShoppingListItem>(`${this.apiUrl}/shopping-list`, { ingredientName, quantity, unit });
  }

  generate(planId: number): Observable<ShoppingListItem[]> {
    return this.http.post<ShoppingListItem[]>(`${this.apiUrl}/plans/${planId}/shopping-list/generate`, {});
  }

  updateItem(itemId: number, checked: boolean): Observable<ShoppingListItem> {
    return this.http.patch<ShoppingListItem>(`${this.apiUrl}/shopping-list/${itemId}`, { checked });
  }

  deleteItem(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/shopping-list/${itemId}`);
  }

  checkout(): Observable<PantryItem[]> {
    return this.http.post<PantryItem[]>(`${this.apiUrl}/shopping-list/checkout`, {});
  }
}
