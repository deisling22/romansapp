import { fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ConnectivityService } from '../../core/connectivity.service';
import { GamificationService } from '../../core/gamification.service';
import { ShoppingListItem } from '../../core/models';
import { NotificationService } from '../../core/notification.service';
import { ShoppingListApiService } from '../../core/shopping-list-api.service';
import { ShoppingListOutboxService } from '../../core/shopping-list-outbox.service';
import { ShoppingListComponent } from './shopping-list.component';

describe('ShoppingListComponent reminders', () => {
  let component: ShoppingListComponent;
  let notifications: jasmine.SpyObj<NotificationService>;
  let item: ShoppingListItem;

  beforeEach(() => {
    const route = { snapshot: { paramMap: { get: () => null } } } as unknown as ActivatedRoute;
    const api = jasmine.createSpyObj<ShoppingListApiService>('ShoppingListApiService', ['updateItem']);
    api.updateItem.and.returnValue(of({} as ShoppingListItem));
    const connectivity = { isOnline: true } as ConnectivityService;
    const outbox = jasmine.createSpyObj<ShoppingListOutboxService>('ShoppingListOutboxService', ['queue']);
    notifications = jasmine.createSpyObj<NotificationService>('NotificationService', ['show']);
    const gamification = jasmine.createSpyObj<GamificationService>('GamificationService', ['record']);
    gamification.record.and.resolveTo();
    component = new ShoppingListComponent(route, api, connectivity, outbox, notifications, gamification);
    item = { id: 7, ingredientName: 'Milch', quantity: 1, unit: 'l', checked: false };
    component.items = [item];
  });

  afterEach(() => component.ngOnDestroy());

  it('reminds after one minute while the item remains in the cart', fakeAsync(() => {
    component.toggle(item);

    tick(59_999);
    expect(notifications.show).not.toHaveBeenCalled();
    tick(1);

    expect(notifications.show).toHaveBeenCalledOnceWith('Milch liegt seit einer Minute im Warenkorb.');
  }));

  it('cancels the reminder when the item is returned to the list', fakeAsync(() => {
    component.toggle(item);
    component.toggle(item);
    tick(60_000);

    expect(notifications.show).not.toHaveBeenCalled();
  }));
});