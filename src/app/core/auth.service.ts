import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { authConfig } from '../auth.config';
import { environment } from '../../environments/environment';

export interface AuthenticatedUser {
  name: string;
  email: string;
  pictureUrl: string | null;
}

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
}