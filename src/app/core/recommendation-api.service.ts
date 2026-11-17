import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Recommendations, Taste } from './models';

@Injectable({ providedIn: 'root' })
export class RecommendationApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getRecommendations(): Observable<Recommendations> {
    return this.http.get<Recommendations>(`${this.apiUrl}/recommendations`);
  }

  /** "Less of this": hides the dish from suggestions and lowers the weight of its tags. */
  lessOf(dishId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/recommendations/dishes/${dishId}/less`, {});
  }

  getTaste(): Observable<Taste> {
    return this.http.get<Taste>(`${this.apiUrl}/taste`);
  }

  setLikedTags(likedTags: string[]): Observable<Taste> {
    return this.http.put<Taste>(`${this.apiUrl}/taste`, { likedTags });
  }
}
