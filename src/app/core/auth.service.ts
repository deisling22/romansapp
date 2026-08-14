import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { authConfig } from '../auth.config';
import { environment } from '../../environments/environment';

export interface AuthenticatedUser {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  pictureUrl: string | null;
}

const TOKEN_STORAGE_KEY = 'speiseplan_auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly backendUrl = environment.apiUrl.replace(/\/api$/, '');

  constructor(private readonly http: HttpClient) {}

  getCurrentUser(): Observable<AuthenticatedUser> {
    return this.http.get<AuthenticatedUser>(`${environment.apiUrl}/auth/me`, {
      withCredentials: true,
    });
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
  }

  clearToken(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}