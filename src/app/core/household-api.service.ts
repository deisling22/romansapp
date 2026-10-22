import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Household, Receipt, RecipeImport } from './models';

/** Household sharing, receipts (spending) and recipe import by URL. */
@Injectable({ providedIn: 'root' })
export class HouseholdApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getHousehold(): Observable<Household> {
    return this.http.get<Household>(`${this.apiUrl}/household`);
  }

  rename(name: string): Observable<Household> {
    return this.http.put<Household>(`${this.apiUrl}/household`, { name });
  }

  createInviteCode(): Observable<Household> {
    return this.http.post<Household>(`${this.apiUrl}/household/invite`, {});
  }

  join(code: string): Observable<Household> {
    return this.http.post<Household>(`${this.apiUrl}/household/join`, { code });
  }

  claimDefault(): Observable<Household> {
    return this.http.post<Household>(`${this.apiUrl}/household/claim-default`, {});
  }

  leave(): Observable<Household> {
    return this.http.post<Household>(`${this.apiUrl}/household/leave`, {});
  }

  removeMember(email: string): Observable<Household> {
    return this.http.delete<Household>(`${this.apiUrl}/household/members/${encodeURIComponent(email)}`);
  }

  getReceipts(from: string, to: string): Observable<Receipt[]> {
    return this.http.get<Receipt[]>(`${this.apiUrl}/receipts`, { params: { from, to } });
  }

  createReceipt(receipt: Receipt): Observable<Receipt> {
    return this.http.post<Receipt>(`${this.apiUrl}/receipts`, receipt);
  }

  deleteReceipt(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/receipts/${id}`);
  }

  importRecipe(url: string): Observable<RecipeImport> {
    return this.http.post<RecipeImport>(`${this.apiUrl}/recipe-import`, { url });
  }

  importRecipeImage(url: string): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/recipe-import/image`, { url }, { responseType: 'blob' });
  }
}
