import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './core/auth.service';
import { environment } from '../environments/environment';

// Authentication uses the backend's secure session cookie where possible, plus a bearer
// token (stored in localStorage after Google login) for requests to the API. The bearer
// token is required because the frontend (GitHub Pages) and backend (Render) are on
// different domains, and browsers such as Safari block cross-site session cookies by
// default (Intelligent Tracking Prevention), even with SameSite=None.
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    if (token && request.url.startsWith(environment.apiUrl)) {
      request = request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
    return next.handle(request);
  }
}
