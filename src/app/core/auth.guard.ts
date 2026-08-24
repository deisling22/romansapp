import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { RecipeSyncService } from './recipe-sync.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly notifications: NotificationService,
    private readonly recipeSync: RecipeSyncService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    // After a Google login, the backend redirects here with ?token=... in the URL.
    // Store it, then re-navigate without the query param once we've confirmed it works.
    const token = route.queryParamMap.get('token');
    if (token) {
      this.authService.setToken(token);
    }
    return this.authService.getCurrentUser().pipe(
      map(() => {
        if (token) {
          this.notifications.show('Anmeldung erfolgreich.', 'success');
          void this.recipeSync.sync();
          return this.router.createUrlTree(['/account']);
        }
        return true;
      }),
      catchError(() => of(this.router.createUrlTree(['/login']))),
    );
  }
}