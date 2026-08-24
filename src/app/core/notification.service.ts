import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppNotification {
  message: string;
  type: 'info' | 'success';
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notificationSubject = new BehaviorSubject<AppNotification | null>(null);
  private dismissTimer: ReturnType<typeof setTimeout> | null = null;

  readonly notification$ = this.notificationSubject.asObservable();

  show(message: string, type: AppNotification['type'] = 'info', durationMs = 5000): void {
    this.clearDismissTimer();
    this.notificationSubject.next({ message, type });
    this.dismissTimer = setTimeout(() => this.dismiss(), durationMs);
  }

  dismiss(): void {
    this.clearDismissTimer();
    this.notificationSubject.next(null);
  }

  private clearDismissTimer(): void {
    if (this.dismissTimer !== null) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }
  }
}