import { NgZone } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { ConnectivityService } from '../../core/connectivity.service';
import { DishApiService } from '../../core/dish-api.service';
import { GamificationService } from '../../core/gamification.service';
import { PantryItem, ShoppingListItem } from '../../core/models';
import { ScheduleApiService } from '../../core/schedule-api.service';
import { ShoppingListApiService } from '../../core/shopping-list-api.service';
import { ShoppingListOutboxService } from '../../core/shopping-list-outbox.service';
import { SnapshotCacheService } from '../../core/snapshot-cache.service';
import { ShoppingListComponent } from './shopping-list.component';

describe('ShoppingListComponent', () => {
  let component: ShoppingListComponent;
  let api: jasmine.SpyObj<ShoppingListApiService>;
  let outbox: jasmine.SpyObj<ShoppingListOutboxService>;
  let connectivity: { isOnline: boolean };
  let milk: ShoppingListItem;
  let bread: ShoppingListItem;

  beforeEach(() => {
    const route = { snapshot: { paramMap: { get: () => null } } } as unknown as ActivatedRoute;
    api = jasmine.createSpyObj<ShoppingListApiService>(
      'ShoppingListApiService', ['updateItem', 'deleteItem', 'checkout', 'getAllItems', 'addItem', 'clear']);
    api.updateItem.and.returnValue(of({} as ShoppingListItem));
    api.deleteItem.and.returnValue(of(undefined));
    api.checkout.and.returnValue(of([]));
    api.getAllItems.and.returnValue(of([]));
    api.clear.and.returnValue(of(undefined));
    connectivity = { isOnline: true };
    outbox = jasmine.createSpyObj<ShoppingListOutboxService>(
      'ShoppingListOutboxService', ['queue', 'queueCheckout', 'notifyBooked']);
    outbox.queue.and.resolveTo();
    outbox.queueCheckout.and.resolveTo();
    const gamification = jasmine.createSpyObj<GamificationService>('GamificationService', ['record']);
    gamification.record.and.resolveTo();
    const snapshots = jasmine.createSpyObj<SnapshotCacheService>('SnapshotCacheService', ['read', 'write']);
    component = new ShoppingListComponent(
      route, api, connectivity as ConnectivityService, outbox, gamification, {} as ScheduleApiService,
      {} as DishApiService, snapshots,
      { run: (fn: () => void) => fn(), runOutsideAngular: (fn: () => void) => fn() } as unknown as NgZone);
    milk = { id: 7, ingredientName: 'Milch', quantity: 1, unit: 'l', checked: false, category: 'Kühlregal' };
    bread = { id: 8, ingredientName: 'Brot', quantity: 1, unit: 'Stk.', checked: false, category: 'Brot & Backwaren' };
    component.items = [milk, bread];
  });

  afterEach(() => component.ngOnDestroy());

  it('groups open items by aisle in walking order and keeps ticked items in the cart', () => {
    component.items = [
      { ...milk },
      { ...bread },
      { id: 9, ingredientName: 'Schraube', quantity: 1, unit: 'Stk.', checked: false },
      { id: 10, ingredientName: 'Apfel', quantity: 2, unit: 'Stk.', checked: true, category: 'Obst & Gemüse' },
    ];

    expect(component.groups.map((group) => group.category)).toEqual(['Brot & Backwaren', 'Kühlregal', 'Sonstiges']);
    expect(component.cartItems.map((item) => item.ingredientName)).toEqual(['Apfel']);
    expect(component.openCount).toBe(3);
  });

  it('sends only the final state when an item is tapped repeatedly', fakeAsync(() => {
    component.toggle(component.items[0]);
    component.toggle(component.items[0]);
    component.toggle(component.items[0]);
    tick(300);

    expect(api.updateItem).toHaveBeenCalledOnceWith(7, true);
    expect(component.cartItems.map((item) => item.id)).toEqual([7]);
  }));

  it('ticking alone never books anything into the pantry', fakeAsync(() => {
    component.toggle(component.items[0]);
    tick(60_000);
    component.ngOnDestroy();

    expect(api.checkout).not.toHaveBeenCalled();
    expect(outbox.queueCheckout).not.toHaveBeenCalled();
  }));

  it('books exactly the cart with one request and without late tick writes', fakeAsync(() => {
    component.toggle(component.items[0]);
    component.finishShopping();
    tick(60_000);

    expect(api.checkout).toHaveBeenCalledOnceWith([7]);
    expect(outbox.notifyBooked).toHaveBeenCalledTimes(1);
    expect(api.updateItem).not.toHaveBeenCalled();
    expect(component.items).toEqual([bread]);
    expect(component.successMessage).toContain('in den Vorratsschrank gebucht');
  }));

  it('queues the purchase when offline and still empties the cart', fakeAsync(() => {
    connectivity.isOnline = false;
    component.toggle(component.items[0]);
    component.finishShopping();
    tick(300);

    expect(api.checkout).not.toHaveBeenCalled();
    expect(outbox.queueCheckout).toHaveBeenCalledOnceWith([7]);
    expect(component.cartItems).toEqual([]);
    expect(component.successMessage).toContain('Offline gespeichert');
  }));

  it('queues the purchase for a retry when the request fails', fakeAsync(() => {
    api.checkout.and.returnValue(throwError(() => new Error('timeout')));
    component.toggle(component.items[0]);
    component.finishShopping();
    tick(300);

    expect(outbox.queueCheckout).toHaveBeenCalledOnceWith([7]);
    expect(component.items).toEqual([bread]);
  }));

  it('ignores a second tap while the purchase is being booked', () => {
    const response = new Subject<PantryItem[]>();
    api.checkout.and.returnValue(response);
    component.items = [{ ...milk, checked: true }, { ...bread, checked: true }];
    component.finishShopping();
    component.finishShopping();

    expect(api.checkout).toHaveBeenCalledTimes(1);
    response.next([]);
    response.complete();
    expect(component.checkingOut).toBeFalse();
  });

  it('shows a typed item at once and replaces it with the server answer', () => {
    const response = new Subject<ShoppingListItem>();
    api.addItem.and.returnValue(response);
    component.quickAddText = '2 Zwiebeln';
    component.addQuickItem();

    expect(api.addItem).toHaveBeenCalledOnceWith('Zwiebeln', 2, 'Stk.');
    expect(component.quickAddText).toBe('');
    expect(component.items.map((item) => item.ingredientName)).toEqual(['Milch', 'Brot', 'Zwiebeln']);
    expect(component.items[2].id).toBeLessThan(0);

    response.next({ id: 11, ingredientName: 'Zwiebeln', quantity: 2, unit: 'Stk.', checked: false });
    expect(component.items.map((item) => item.id)).toEqual([7, 8, 11]);
  });

  it('merges a typed item into the existing row the server returns', () => {
    api.addItem.and.returnValue(of({ ...milk, quantity: 2 }));
    component.quickAddText = '1 l Milch';
    component.addQuickItem();

    expect(component.items.length).toBe(2);
    expect(component.items.find((item) => item.id === 7)?.quantity).toBe(2);
  });

  it('removes an item at once and restores it when the server refuses', () => {
    api.deleteItem.and.returnValue(throwError(() => new Error('Server unavailable')));
    component.remove(milk);

    expect(component.items).toEqual([milk, bread]);
    expect(component.errorMessage).toContain('Milch');
  });

  it('describes the pack that ends up in the pantry', () => {
    expect(component.packHint({ ...milk, quantity: 120, unit: 'g', purchaseQuantity: 250, packSize: 250 })).toBe('1 × 250 g');
    expect(component.packHint({ ...milk, quantity: 250, unit: 'g', purchaseQuantity: 250, packSize: 250 })).toBe('');
    expect(component.packHint(milk)).toBe('');
  });
});
