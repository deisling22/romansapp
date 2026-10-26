import { NgZone } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { ConnectivityService } from '../../core/connectivity.service';
import { GamificationService } from '../../core/gamification.service';
import { ShoppingListItem } from '../../core/models';
import { NotificationService } from '../../core/notification.service';
import { ScheduleApiService } from '../../core/schedule-api.service';
import { ShoppingListApiService } from '../../core/shopping-list-api.service';
import { ShoppingListOutboxService } from '../../core/shopping-list-outbox.service';
import { ShoppingListComponent } from './shopping-list.component';

describe('ShoppingListComponent reminders', () => {
  let component: ShoppingListComponent;
  let notifications: jasmine.SpyObj<NotificationService>;
  let api: jasmine.SpyObj<ShoppingListApiService>;
  let item: ShoppingListItem;

  beforeEach(() => {
    const route = { snapshot: { paramMap: { get: () => null } } } as unknown as ActivatedRoute;
    api = jasmine.createSpyObj<ShoppingListApiService>('ShoppingListApiService', ['updateItem', 'deleteItem', 'checkout', 'getAllItems']);
    api.updateItem.and.returnValue(of({} as ShoppingListItem));
    api.deleteItem.and.returnValue(of(undefined));
    api.checkout.and.returnValue(of([]));
    api.getAllItems.and.returnValue(of([]));
    const connectivity = { isOnline: true } as ConnectivityService;
    const outbox = jasmine.createSpyObj<ShoppingListOutboxService>('ShoppingListOutboxService', ['queue']);
    notifications = jasmine.createSpyObj<NotificationService>('NotificationService', ['show']);
    const gamification = jasmine.createSpyObj<GamificationService>('GamificationService', ['record']);
    gamification.record.and.resolveTo();
    component = new ShoppingListComponent(
      route, api, connectivity, outbox, notifications, gamification, {} as ScheduleApiService,
      { run: (fn: () => void) => fn(), runOutsideAngular: (fn: () => void) => fn() } as unknown as NgZone);
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

  it('sends only the final state when an item is tapped repeatedly', fakeAsync(() => {
    component.toggle(item);
    component.toggle(item);
    component.toggle(item);
    tick(300);

    expect(api.updateItem).toHaveBeenCalledOnceWith(7, true);
    tick(60_000);
  }));

  it('selects all and clears all, including a partial selection', fakeAsync(() => {
    component.items.push({ ...item, id: 8, ingredientName: 'Brot', checked: true });
    expect(component.allSelected).toBeFalse();
    component.selectAll();
    expect(component.allSelected).toBeTrue();
    component.selectAll();
    expect(component.checkedItems).toEqual([]);
    tick(300);
    expect(api.updateItem.calls.allArgs()).toEqual([[7, false], [8, false]]);
  }));

  it('removes only selected items and cancels pending checkbox writes', fakeAsync(() => {
    const other = { ...item, id: 8, ingredientName: 'Brot' };
    component.items.push(other);
    component.toggle(item);
    component.removeSelected();
    tick(60_000);
    expect(api.deleteItem).toHaveBeenCalledOnceWith(7);
    expect(api.updateItem).not.toHaveBeenCalled();
    expect(component.items).toEqual([other]);
    expect(notifications.show).not.toHaveBeenCalled();
    expect(component.removingSelected).toBeFalse();
  }));

  it('blocks repeated removal and toggles while removing', () => {
    item.checked = true;
    const response = new Subject<void>();
    api.deleteItem.and.returnValue(response);
    component.removeSelected();
    component.removeSelected();
    component.toggle(item);
    expect(api.deleteItem).toHaveBeenCalledTimes(1);
    expect(item.checked).toBeTrue();
    response.next();
    response.complete();
    expect(component.items).toEqual([]);
  });

  it('keeps failed and remaining items selected after a partial deletion', () => {
    item.checked = true;
    const other = { ...item, id: 8, ingredientName: 'Brot' };
    component.items.push(other);
    api.deleteItem.and.callFake((id) => id === 7 ? of(undefined) : throwError(() => new Error('Server unavailable')));
    component.removeSelected();
    expect(component.items).toEqual([other]);
    expect(component.removingSelected).toBeFalse();
    expect(component.errorMessage).toContain('Nicht alle');
    expect(component.successMessage).toBe('');
  });

  it('moves selected items through checkout without delayed duplicate writes', fakeAsync(() => {
    component.selectAll();
    component.finishShopping();
    tick(60_000);
    expect(api.updateItem).toHaveBeenCalledOnceWith(7, true);
    expect(api.checkout).toHaveBeenCalledTimes(1);
    expect(component.items).toEqual([]);
    expect(component.successMessage).toContain('in den Vorratsschrank gebucht');
    expect(notifications.show).not.toHaveBeenCalled();
  }));

  it('does not select an empty list', () => {
    component.items = [];
    component.selectAll();
    expect(component.allSelected).toBeFalse();
    expect(api.updateItem).not.toHaveBeenCalled();
  });
});