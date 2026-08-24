import { Injectable } from '@angular/core';
import { EMPTY, catchError, filter, switchMap, timer } from 'rxjs';
import { AuthService } from './auth.service';
import { CreatorApiService } from './creator-api.service';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class CreatorNotificationService {
  constructor(
    private readonly auth: AuthService,
    private readonly creatorApi: CreatorApiService,
    private readonly notifications: NotificationService,
  ) {
    timer(0, 60_000).pipe(
      filter(() => Boolean(this.auth.getToken())),
      switchMap(() => this.creatorApi.pollNotifications().pipe(catchError(() => EMPTY))),
    ).subscribe((updates) => this.showUpdates(updates));
  }

  refresh(): void {
    if (!this.auth.getToken()) {
      return;
    }
    this.creatorApi.pollNotifications().pipe(catchError(() => EMPTY))
      .subscribe((updates) => this.showUpdates(updates));
  }

  private showUpdates(updates: Array<{
    creatorName: string;
    newPlanCount: number;
    newDishCount: number;
  }>): void {
    if (updates.length === 0) {
      return;
    }
    const update = updates[0];
    const parts = [];
    if (update.newPlanCount > 0) {
      parts.push(`${update.newPlanCount} neue ${update.newPlanCount === 1 ? 'Plan' : 'Pläne'}`);
    }
    if (update.newDishCount > 0) {
      parts.push(`${update.newDishCount} neue ${update.newDishCount === 1 ? 'Gericht' : 'Gerichte'}`);
    }
    this.notifications.show(`${update.creatorName}: ${parts.join(' und ')}`, 'info', 8000);
  }
}