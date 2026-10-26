import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, concatMap, finalize, forkJoin, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { ShoppingListApiService } from '../../core/shopping-list-api.service';
import { ShoppingListItem } from '../../core/models';
import { ConnectivityService } from '../../core/connectivity.service';
import { ShoppingListOutboxService } from '../../core/shopping-list-outbox.service';
import { NotificationService } from '../../core/notification.service';
import { GamificationService } from '../../core/gamification.service';
import { ScheduleApiService } from '../../core/schedule-api.service';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, DecimalPipe } from '@angular/common';

const CART_REMINDER_DELAY_MS = 60_000;
const TOGGLE_SYNC_DELAY_MS = 300;

@Component({
    selector: 'app-shopping-list',
    templateUrl: './shopping-list.component.html',
    styleUrls: ['./shopping-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterLink, FormsModule, AsyncPipe, DecimalPipe]
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
  finishingCheckout = false;
  removingSelected = false;
  private readonly reminderTimers = new Map<number, ReturnType<typeof setTimeout>>();
  private readonly pendingToggles = new Map<number, { checked: boolean; timer: ReturnType<typeof setTimeout> }>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly shoppingListApi: ShoppingListApiService,
    readonly connectivity: ConnectivityService,
    private readonly outbox: ShoppingListOutboxService,
    private readonly notifications: NotificationService,
    private readonly gamification: GamificationService,
    private readonly scheduleApi: ScheduleApiService,
    private readonly zone: NgZone,
  ) {}

  ngOnInit(): void {
    const planId = this.route.snapshot.paramMap.get('planId');
    this.hasPlanContext = planId !== null;
    this.planId = Number(planId);
    this.load();
    // Household members share one list: pick up their changes while the list is open.
    this.zone.runOutsideAngular(() => {
      this.refreshTimer = setInterval(() => this.refreshInBackground(), 20_000);
      document.addEventListener('visibilitychange', this.onVisibilityChange);
    });
  }

  private refreshTimer: ReturnType<typeof setInterval> | undefined;

  private readonly onVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      this.refreshInBackground();
    }
  };

  private refreshInBackground(): void {
    const busy = this.loading || this.adding || this.generating || this.finishingCheckout || this.removingSelected
      || this.deletingItemId !== null || this.pendingToggles.size > 0;
    if (busy || document.visibilityState !== 'visible' || !navigator.onLine) {
      return;
    }
    this.zone.run(() => {
      const request = this.hasPlanContext
        ? this.shoppingListApi.getItems(this.planId)
        : this.shoppingListApi.getAllItems();
      request.subscribe({
        next: (items) => {
          if (this.pendingToggles.size === 0 && this.listState(items) !== this.listState(this.items)) {
            this.items = items;
          }
        },
        error: () => undefined,
      });
    });
  }

  private listState(items: ShoppingListItem[]): string {
    return items.map((item) => `${item.id}:${item.quantity}:${item.checked}`).join('|');
  }

  ngOnDestroy(): void {
    clearInterval(this.refreshTimer);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    for (const timer of this.reminderTimers.values()) {
      clearTimeout(timer);
    }
    this.reminderTimers.clear();
    for (const [itemId, pending] of this.pendingToggles) {
      clearTimeout(pending.timer);
      this.syncToggle(itemId, pending.checked);
    }
    this.pendingToggles.clear();
  }

  get openItems(): ShoppingListItem[] {
    return this.items.filter((item) => !item.checked);
  }

  get checkedItems(): ShoppingListItem[] {
    return this.items.filter((item) => item.checked);
  }

  get allSelected(): boolean {
    return this.items.length > 0 && this.checkedItems.length === this.items.length;
  }

  get bulkBusy(): boolean {
    return this.removingSelected || this.finishingCheckout || this.deletingItemId !== null;
  }

  selectAll(): void {
    if (this.bulkBusy) {
      return;
    }
    const checked = !this.allSelected;
    for (const item of this.items) {
      if (item.checked !== checked) {
        this.toggle(item);
      }
    }
    this.successMessage = checked ? 'Alle Artikel sind ausgewählt.' : 'Die Auswahl wurde aufgehoben.';
  }

  removeSelected(): void {
    if (this.bulkBusy || this.checkedItems.length === 0) {
      return;
    }
    if (!this.connectivity.isOnline) {
      this.errorMessage = 'Zum Entfernen der ausgewählten Artikel ist eine Internetverbindung erforderlich.';
      return;
    }
    const selected = this.checkedItems;
    this.removingSelected = true;
    this.errorMessage = '';
    this.successMessage = '';
    for (const item of selected) {
      this.cancelPendingToggle(item.id);
    }
    from(selected).pipe(
      concatMap((item) => this.shoppingListApi.deleteItem(item.id).pipe(
        tap(() => {
          this.cancelReminder(item.id);
          this.items = this.items.filter((entry) => entry.id !== item.id);
        }),
      )),
      finalize(() => (this.removingSelected = false)),
    ).subscribe({
      complete: () => {
        this.successMessage = `${selected.length} ${selected.length === 1 ? 'Artikel wurde' : 'Artikel wurden'} entfernt.`;
      },
      error: () => {
        this.errorMessage = 'Nicht alle ausgewählten Artikel konnten entfernt werden. Bitte erneut versuchen.';
      },
    });
  }

  private cancelPendingToggle(itemId: number): void {
    const pending = this.pendingToggles.get(itemId);
    if (pending) {
      clearTimeout(pending.timer);
      this.pendingToggles.delete(itemId);
    }
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
    if (!name || !unit || this.newQuantity <= 0 || this.adding || this.bulkBusy) {
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
    if (this.generating || this.bulkBusy) {
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

  generateUpcoming(): void {
    if (this.generating || this.bulkBusy) {
      return;
    }
    this.generating = true;
    this.errorMessage = '';
    this.successMessage = '';
    const before = this.listSignature(this.items);
    this.scheduleApi.generateUpcomingShoppingList().subscribe({
      next: (items) => {
        this.items = items;
        this.generating = false;
        this.successMessage = this.listSignature(items) === before
          ? 'Für die nächsten Tage ist alles im Vorrat oder schon auf der Liste.'
          : 'Die Liste für die nächsten Tage wurde ergänzt.';
      },
      error: () => {
        this.errorMessage = 'Die Einkaufsliste für die nächsten Tage konnte nicht erstellt werden.';
        this.generating = false;
      },
    });
  }

  private listSignature(items: ShoppingListItem[]): string {
    return items.map((item) => `${item.id}:${item.quantity}`).sort().join('|');
  }

  toggle(item: ShoppingListItem): void {
    if (this.bulkBusy) {
      return;
    }
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

    // Rapid taps on the same row only send the final state.
    const pending = this.pendingToggles.get(item.id);
    if (pending) {
      clearTimeout(pending.timer);
    }
    const timer = setTimeout(() => {
      this.pendingToggles.delete(item.id);
      this.syncToggle(item.id, checked);
    }, TOGGLE_SYNC_DELAY_MS);
    this.pendingToggles.set(item.id, { checked, timer });
  }

  private syncToggle(itemId: number, checked: boolean): void {
    if (!this.connectivity.isOnline) {
      void this.outbox.queue(itemId, checked);
      return;
    }

    this.shoppingListApi.updateItem(itemId, checked).subscribe({
      error: () => {
        void this.outbox.queue(itemId, checked);
      },
    });
  }

  remove(item: ShoppingListItem): void {
    if (this.bulkBusy) {
      return;
    }
    this.deletingItemId = item.id;
    this.shoppingListApi.deleteItem(item.id).subscribe({
      next: () => {
        this.cancelPendingToggle(item.id);
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
    if (this.removingSelected) {
      this.errorMessage = 'Bitte warte, bis die ausgewählten Artikel entfernt wurden.';
      return of(false);
    }
    const checkedItems = this.checkedItems;
    if (checkedItems.length === 0 || !this.connectivity.isOnline) {
      return of(true);
    }

    for (const item of checkedItems) {
      this.cancelPendingToggle(item.id);
    }
    return forkJoin(checkedItems.map((item) => this.shoppingListApi.updateItem(item.id, true))).pipe(
      switchMap(() => this.shoppingListApi.checkout()),
      tap(() => checkedItems.forEach((item) => this.cancelReminder(item.id))),
      tap(() => void this.gamification.record('COMPLETE_SHOPPING', this.planId ? String(this.planId) : undefined)),
      map(() => true),
      catchError(() => {
        this.errorMessage = 'Die gekauften Artikel konnten noch nicht in den Vorrat übernommen werden.';
        return of(false);
      }),
    );
  }

  finishShopping(): void {
    if (this.bulkBusy || this.checkedItems.length === 0) {
      return;
    }
    const movedCount = this.checkedItems.length;
    const wasOnline = this.connectivity.isOnline;
    this.finishingCheckout = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.prepareForExit().subscribe((success) => {
      this.finishingCheckout = false;
      if (!success) {
        return;
      }
      if (!wasOnline) {
        this.successMessage = 'Offline gespeichert – wird automatisch in den Vorrat gebucht, sobald du wieder online bist.';
        return;
      }
      this.successMessage = `${movedCount} ${movedCount === 1 ? 'Artikel wurde' : 'Artikel wurden'} in den Vorratsschrank gebucht.`;
      this.load();
    });
  }
}
