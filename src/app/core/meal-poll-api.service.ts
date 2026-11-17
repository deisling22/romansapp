import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MealSlot } from './models';

export interface PollOption {
  entryId: number;
  dishId: number;
  name: string;
  imageUrl: string;
  mealSlot: MealSlot;
}

export interface PublicMealPoll {
  id: string;
  createdAt: string;
  expiresAt: string;
  closed: boolean;
  options: PollOption[];
}

export interface ManagedMealPoll {
  poll: PublicMealPoll;
  voteCount: number;
  results: { option: PollOption; averageRank: number | null }[];
  votes: { name: string; ranking: number[] }[];
}

@Injectable({ providedIn: 'root' })
export class MealPollApiService {
  private readonly url = `${environment.apiUrl}/meal-polls`;
  private readonly publicUrl = `${environment.apiUrl}/public/meal-polls`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<ManagedMealPoll[]> {
    return this.http.get<ManagedMealPoll[]>(this.url, { withCredentials: true });
  }

  create(): Observable<ManagedMealPoll> {
    return this.http.post<ManagedMealPoll>(this.url, {}, { withCredentials: true });
  }

  manage(id: string): Observable<ManagedMealPoll> {
    return this.http.get<ManagedMealPoll>(`${this.url}/${encodeURIComponent(id)}`, { withCredentials: true });
  }

  close(id: string): Observable<ManagedMealPoll> {
    return this.http.post<ManagedMealPoll>(`${this.url}/${encodeURIComponent(id)}/close`, {}, { withCredentials: true });
  }

  apply(id: string, count: number): Observable<ManagedMealPoll> {
    return this.http.post<ManagedMealPoll>(`${this.url}/${encodeURIComponent(id)}/apply`, { count }, { withCredentials: true });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${encodeURIComponent(id)}`, { withCredentials: true });
  }

  getPublic(id: string): Observable<PublicMealPoll> {
    return this.http.get<PublicMealPoll>(`${this.publicUrl}/${encodeURIComponent(id)}`);
  }

  vote(id: string, name: string, ranking: number[]): Observable<void> {
    return this.http.post<void>(`${this.publicUrl}/${encodeURIComponent(id)}/votes`, { name, ranking });
  }
}
