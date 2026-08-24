import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, CanDeactivateFn } from '@angular/router';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { ShoppingListApiService } from '../../core/shopping-list-api.service';
import { ShoppingListItem } from '../../core/models';
import { ConnectivityService } from '../../core/connectivity.service';
import { ShoppingListOutboxService } from '../../core/shopping-list-outbox.service';
import { NotificationService } from '../../core/notification.service';

const CART_REMINDER_DELAY_MS = 60_000;

@Component({
    selector: 'app-shopping-list',
    templateUrl: './shopping-list.component.html',
    styleUrls: ['./shopping-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  planId = 0;
  hasPlanContext = false;
  items: ShoppingListItem[] = [];
  loading = true;
  generating = false;
  errorMessage = '';
  successMessage = '';
  newIngredientName = '';
  newQuantity = 1;
  newUnit = 'Stk.';
  adding = false;
  deletingItemId: number | null = null;
  private readonly reminderTimers = new Map<number, ReturnType<typeof setTimeout>>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly shoppingListApi: ShoppingListApiService,
    readonly connectivity: ConnectivityService,
    private readonly outbox: ShoppingListOutboxService,
    private readonly notifications: NotificationService,
  ) {}

  ngOnInit(): void {
    const planId = this.route.snapshot.paramMap.get('planId');
    this.hasPlanContext = planId !== null;
    this.planId = Number(planId);
    this.load();
  }

  ngOnDestroy(): void {
    for (const timer of this.reminderTimers.values()) {
      clearTimeout(timer);
    }
    this.reminderTimers.clear();
  }

  get openItems(): ShoppingListItem[] {
    return this.items.filter((item) => !item.checked);
  }

  get checkedItems(): ShoppingListItem[] {
    return this.items.filter((item) => item.checked);
  }

  load(): void {
    this.loading = true;
    const request = this.hasPlanContext
      ? this.shoppingListApi.getItems(this.planId)
      : this.shoppingListApi.getAllItems();
    request.subscribe({
      next: (items) => {
        this.items = items;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Die Einkaufsliste konnte nicht geladen werden.';
        this.loading = false;
      },
    });
  }

  addItem(): void {
    const name = this.newIngredientName.trim();
    const unit = this.newUnit.trim();
    if (!name || !unit || this.newQuantity <= 0 || this.adding) {
      return;
    }
    this.adding = true;
    this.successMessage = '';
    this.shoppingListApi.addItem(name, this.newQuantity, unit).subscribe({
      next: (item) => {
        const existingIndex = this.items.findIndex((entry) => entry.id === item.id);
        this.items = existingIndex === -1
          ? [...this.items, item]
          : this.items.map((entry) => entry.id === item.id ? item : entry);
        this.newIngredientName = '';
        this.newQuantity = 1;
        this.successMessage = `${item.ingredientName} wurde hinzugefügt.`;
        this.adding = false;
      },
      error: () => {
        this.errorMessage = 'Der Artikel konnte nicht hinzugefügt werden.';
        this.adding = false;
      },
    });
  }

  generate(): void {
    if (this.generating) {
      return;
    }
    this.generating = true;
    this.shoppingListApi.generate(this.planId).subscribe({
      next: (items) => {
        this.items = items;
        this.generating = false;
      },
      error: () => {
        this.errorMessage = 'Die Einkaufsliste konnte nicht erstellt werden.';
        this.generating = false;
      },
    });
  }

  toggle(item: ShoppingListItem): void {
    const checked = !item.checked;
    item.checked = checked;
    this.successMessage = checked
      ? `${item.ingredientName} liegt jetzt im Wagen.`
      : `${item.ingredientName} steht wieder auf der Liste.`;
    if (checked) {
      this.scheduleReminder(item);
    } else {
      this.cancelReminder(item.id);
    }

    if (!this.connectivity.isOnline) {
      void this.outbox.queue(item.id, checked);
      return;
    }

    this.shoppingListApi.updateItem(item.id, checked).subscribe({
      error: () => {
        void this.outbox.queue(item.id, checked);
      },
    });
  }

  remove(item: ShoppingListItem): void {
    if (this.deletingItemId !== null) {
      return;
    }
    this.deletingItemId = item.id;
    this.shoppingListApi.deleteItem(item.id).subscribe({
      next: () => {
        this.cancelReminder(item.id);
        this.items = this.items.filter((entry) => entry.id !== item.id);
        this.successMessage = `${item.ingredientName} wurde entfernt.`;
        this.deletingItemId = null;
      },
      error: () => {
        this.errorMessage = 'Der Artikel konnte nicht entfernt werden.';
        this.deletingItemId = null;
      },
    });
  }

  private scheduleReminder(item: ShoppingListItem): void {
    this.cancelReminder(item.id);
    const timer = setTimeout(() => {
      this.reminderTimers.delete(item.id);
      if (this.items.some((entry) => entry.id === item.id && entry.checked)) {
        this.notifications.show(`${item.ingredientName} liegt seit einer Minute im Warenkorb.`);
      }
    }, CART_REMINDER_DELAY_MS);
    this.reminderTimers.set(item.id, timer);
  }

  private cancelReminder(itemId: number): void {
    const timer = this.reminderTimers.get(itemId);
    if (timer !== undefined) {
      clearTimeout(timer);
      this.reminderTimers.delete(itemId);
    }
  }

  prepareForExit(): Observable<boolean> {
    const checkedItems = this.checkedItems;
    if (checkedItems.length === 0 || !this.connectivity.isOnline) {
      return of(true);
    }

    return forkJoin(checkedItems.map((item) => this.shoppingListApi.updateItem(item.id, true))).pipe(
      switchMap(() => this.shoppingListApi.checkout()),
      map(() => true),
      catchError(() => {
        this.errorMessage = 'Die gekauften Artikel konnten noch nicht in den Vorrat übernommen werden.';
        return of(false);
      }),
    );
  }
}

export const pendingCartCheckoutGuard: CanDeactivateFn<ShoppingListComponent> = (component) =>
  component.prepareForExit();

