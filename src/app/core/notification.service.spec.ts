import { fakeAsync, tick } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  it('shows and automatically dismisses a notification', fakeAsync(() => {
    const service = new NotificationService();
    const messages: Array<string | null> = [];
    service.notification$.subscribe((notification) => messages.push(notification?.message ?? null));

    service.show('Gespeichert', 'success', 1000);
    expect(messages.at(-1)).toBe('Gespeichert');

    tick(1000);
    expect(messages.at(-1)).toBeNull();
  }));
});