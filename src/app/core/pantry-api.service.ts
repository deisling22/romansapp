import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PantryItem } from './models';

@Injectable({ providedIn: 'root' })
export class PantryApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getItems(): Observable<PantryItem[]> {
    return this.http.get<PantryItem[]>(`${this.apiUrl}/pantry`);
  }

  addBatch(items: Array<{ ingredientName: string; quantity: number; unit: string }>): Observable<PantryItem[]> {
    return this.http.post<PantryItem[]>(`${this.apiUrl}/pantry/batches`, { items });
  }

  deleteItem(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/pantry/${itemId}`);
  }
}
