import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Recommendations } from './models';

@Injectable({ providedIn: 'root' })
export class RecommendationApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getRecommendations(): Observable<Recommendations> {
    return this.http.get<Recommendations>(`${this.apiUrl}/recommendations`);
  }
}
