import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { authConfig } from '../auth.config';
import { environment } from '../../environments/environment';
import { SnapshotCacheService } from './snapshot-cache.service';

export interface AuthenticatedUser {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  pictureUrl: string | null;
}

const TOKEN_STORAGE_KEY = 'speiseplan_auth_token';
const CURRENT_USER_TTL_MS = 5 * 60_000;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly backendUrl = environment.apiUrl.replace(/\/api$/, '');

  constructor(
    private readonly http: HttpClient,
    private readonly snapshots: SnapshotCacheService,
  ) {}

  /** Remembered for a few minutes: several screens ask, and "not signed in" is an answer too. */
  private currentUser: { loadedAt: number; user: AuthenticatedUser | null } | null = null;

  getCurrentUser(): Observable<AuthenticatedUser> {
    const known = this.currentUser;
    if (known && Date.now() - known.loadedAt < CURRENT_USER_TTL_MS) {
      return known.user ? of(known.user) : throwError(() => new HttpErrorResponse({ status: 401 }));
    }
    return this.http.get<AuthenticatedUser>(`${environment.apiUrl}/auth/me`, {
      withCredentials: true,
    }).pipe(
      tap((user) => (this.currentUser = { loadedAt: Date.now(), user })),
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.currentUser = { loadedAt: Date.now(), user: null };
        }
        return throwError(() => error);
      }),
    );
  }

  signInWithGoogle(): void {
    window.location.assign(`${this.backendUrl}${authConfig.googleAuthorizationPath}`);
  }

  // The bearer token is used instead of (or alongside) the session cookie because the
  // frontend (GitHub Pages) and backend (Render) are on different domains, and browsers
  // such as Safari block cross-site cookies by default even with SameSite=None.
  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    this.currentUser = null;
    // Another account means another household: its snapshots must not show up.
    this.snapshots.clear();
  }

  clearToken(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    this.currentUser = null;
    this.snapshots.clear();
  }
}