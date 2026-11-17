import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ShoppingListApiService } from '../../core/shopping-list-api.service';
import { ShoppingListItem } from '../../core/models';
import { ConnectivityService } from '../../core/connectivity.service';
import { ShoppingListOutboxService } from '../../core/shopping-list-outbox.service';
import { GamificationService } from '../../core/gamification.service';
import { ScheduleApiService } from '../../core/schedule-api.service';
import { DishApiService } from '../../core/dish-api.service';
import { SnapshotCacheService } from '../../core/snapshot-cache.service';
import { parseQuickAdd } from '../../core/quick-add';
import { SwipeToRemoveDirective } from '../../shared/swipe-to-remove.directive';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, DecimalPipe } from '@angular/common';

const TOGGLE_SYNC_DELAY_MS = 300;
const OTHER_CATEGORY = 'Sonstiges';
const INGREDIENT_NAMES_SNAPSHOT = 'ingredient-names';
/** Order of a typical walk through the supermarket. */
const CATEGORY_ORDER = [
  'Obst & Gemüse',
  'Brot & Backwaren',
  'Kühlregal',
  'Fleisch & Fisch',
  'Vorrat & Konserven',
  'Tiefkühl',
  'Getränke',
  OTHER_CATEGORY,
];

export interface ShoppingListGroup {
  category: string;
  items: ShoppingListItem[];
}

@Component({
    selector: 'app-shopping-list',
    templateUrl: './shopping-list.component.html',
    styleUrls: ['./shopping-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterLink, FormsModule, AsyncPipe, DecimalPipe, SwipeToRemoveDirective]
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  planId = 0;
  hasPlanContext = false;
  loading = true;
  generating = false;
  checkingOut = false;
  clearing = false;
  errorMessage = '';
  successMessage = '';
  quickAddText = '';
  ingredientNames: string[] = [];
  /** Open items grouped by aisle. */
  groups: ShoppingListGroup[] = [];
  /** Ticked items: they are in the cart until the purchase is completed. */
  cartItems: ShoppingListItem[] = [];

  private allItems: ShoppingListItem[] = [];
  private nextTemporaryId = -1;
  private ingredientNamesRequested = false;
  private refreshTimer: ReturnType<typeof setInterval> | undefined;
  private readonly pendingToggles = new Map<number, { checked: boolean; timer: ReturnType<typeof setTimeout> }>();
  /** Purchases that are booked but not yet confirmed by the server must not reappear on refresh. */
  private readonly checkedOutIds = new Set<number>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly shoppingListApi: ShoppingListApiService,
    readonly connectivity: ConnectivityService,
    private readonly outbox: ShoppingListOutboxService,
    private readonly gamification: GamificationService,
    private readonly scheduleApi: ScheduleApiService,
    private readonly dishApi: DishApiService,
    private readonly snapshots: SnapshotCacheService,
    private readonly zone: NgZone,
  ) {}

  get items(): ShoppingListItem[] {
    return this.allItems;
  }

  set items(items: ShoppingListItem[]) {
    this.allItems = items;
    this.cartItems = items.filter((item) => item.checked);
    const byCategory = new Map<string, ShoppingListItem[]>();
    for (const item of items) {
      if (!item.checked) {
        const category = item.category ?? OTHER_CATEGORY;
        byCategory.set(category, [...(byCategory.get(category) ?? []), item]);
      }
    }
    this.groups = [...byCategory.entries()]
      .map(([category, groupItems]) => ({ category, items: groupItems }))
      .sort((a, b) => categoryRank(a.category) - categoryRank(b.category));
  }

  get openCount(): number {
    return this.allItems.length - this.cartItems.length;
  }

  ngOnInit(): void {
    const planId = this.route.snapshot.paramMap.get('planId');
    this.hasPlanContext = planId !== null;
    this.planId = Number(planId);
    const snapshot = this.snapshots.read<ShoppingListItem[]>(this.snapshotKey);
    if (snapshot) {
      this.items = snapshot;
      this.loading = false;
    }
    this.load();
    // Household members share one list: pick up their changes while the list is open.
    this.zone.runOutsideAngular(() => {
      this.refreshTimer = setInterval(() => this.refreshInBackground(), 20_000);
      document.addEventListener('visibilitychange', this.onVisibilityChange);
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.refreshTimer);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    for (const [itemId, pending] of this.pendingToggles) {
      clearTimeout(pending.timer);
      this.syncToggle(itemId, pending.checked);
    }
    this.pendingToggles.clear();
  }

  load(): void {
    this.fetch().subscribe({
      next: (items) => {
        this.applyServerItems(items);
        this.loading = false;
      },
      error: () => {
        if (this.loading) {
          this.errorMessage = 'Die Einkaufsliste konnte nicht geladen werden.';
        }
        this.loading = false;
      },
    });
  }

  /** The ingredient catalog feeds the suggestions, so names match the recipes without typing them exactly. */
  loadIngredientNames(): void {
    if (this.ingredientNamesRequested) {
      return;
    }
    this.ingredientNamesRequested = true;
    this.ingredientNames = this.snapshots.read<string[]>(INGREDIENT_NAMES_SNAPSHOT) ?? [];
    this.dishApi.getIngredients().subscribe({
      next: (ingredients) => {
        this.ingredientNames = [...new Set(ingredients.map((ingredient) => ingredient.name))]
          .sort((a, b) => a.localeCompare(b, 'de'));
        this.snapshots.write(INGREDIENT_NAMES_SNAPSHOT, this.ingredientNames);
      },
      error: () => (this.ingredientNamesRequested = false),
    });
  }

  addQuickItem(): void {
    const parsed = parseQuickAdd(this.quickAddText);
    if (!parsed) {
      return;
    }
    // Shown immediately; the server answer replaces the placeholder (or merges it into an existing row).
    const placeholder: ShoppingListItem = { id: this.nextTemporaryId--, checked: false, ...parsed };
    this.items = [...this.items, placeholder];
    this.quickAddText = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.shoppingListApi.addItem(parsed.ingredientName, parsed.quantity, parsed.unit).subscribe({
      next: (item) => {
        this.items = [...this.items.filter((entry) => entry.id !== placeholder.id && entry.id !== item.id), item];
        this.saveSnapshot();
        this.successMessage = `${item.ingredientName} wurde hinzugefügt.`;
      },
      error: () => {
        this.items = this.items.filter((entry) => entry.id !== placeholder.id);
        this.quickAddText = this.quickAddText || `${parsed.quantity} ${parsed.unit} ${parsed.ingredientName}`;
        this.errorMessage = 'Der Artikel konnte nicht hinzugefügt werden.';
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
        this.applyServerItems(items);
        this.generating = false;
      },
      error: () => {
        this.errorMessage = 'Die Einkaufsliste konnte nicht erstellt werden.';
        this.generating = false;
      },
    });
  }

  generateUpcoming(): void {
    if (this.generating) {
      return;
    }
    this.generating = true;
    this.errorMessage = '';
    this.successMessage = '';
    const before = this.listSignature(this.items);
    this.scheduleApi.generateUpcomingShoppingList().subscribe({
      next: (items) => {
        this.applyServerItems(items);
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

  /** Ticking only means "in the cart"; nothing is booked before the purchase is completed. */
  toggle(item: ShoppingListItem): void {
    if (item.id < 0) {
      return;
    }
    const checked = !item.checked;
    this.items = this.items.map((entry) => (entry.id === item.id ? { ...entry, checked } : entry));
    this.successMessage = '';
    this.saveSnapshot();

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

  remove(item: ShoppingListItem): void {
    if (item.id < 0) {
      return;
    }
    const previous = this.items;
    this.cancelPendingToggle(item.id);
    this.items = this.items.filter((entry) => entry.id !== item.id);
    this.errorMessage = '';
    this.successMessage = `${item.ingredientName} wurde entfernt.`;
    this.shoppingListApi.deleteItem(item.id).subscribe({
      next: () => this.saveSnapshot(),
      error: () => {
        this.items = previous;
        this.successMessage = '';
        this.errorMessage = `${item.ingredientName} konnte nicht entfernt werden.`;
      },
    });
  }

  clearList(): void {
    if (this.clearing || this.items.length === 0 || !confirm('Die ganze Einkaufsliste leeren?')) {
      return;
    }
    const previous = this.items;
    this.clearing = true;
    for (const item of previous) {
      this.cancelPendingToggle(item.id);
    }
    this.items = [];
    this.shoppingListApi.clear().subscribe({
      next: () => {
        this.clearing = false;
        this.saveSnapshot();
        this.successMessage = 'Die Einkaufsliste ist leer.';
      },
      error: () => {
        this.clearing = false;
        this.items = previous;
        this.errorMessage = 'Die Liste konnte nicht geleert werden.';
      },
    });
  }

  /**
   * The one explicit step that moves the cart into the pantry. It never depends on leaving the page,
   * and without a connection the purchase is queued and booked automatically later.
   */
  finishShopping(): void {
    const purchased = this.cartItems.filter((item) => item.id > 0);
    if (this.checkingOut || purchased.length === 0) {
      return;
    }
    const itemIds = purchased.map((item) => item.id);
    for (const itemId of itemIds) {
      this.cancelPendingToggle(itemId);
      this.checkedOutIds.add(itemId);
    }
    this.items = this.items.filter((item) => !itemIds.includes(item.id));
    this.saveSnapshot();
    this.errorMessage = '';
    const booked = `${purchased.length} ${purchased.length === 1 ? 'Artikel wurde' : 'Artikel wurden'}`;

    if (!this.connectivity.isOnline) {
      void this.outbox.queueCheckout(itemIds);
      this.successMessage = `Offline gespeichert – ${booked} in den Vorratsschrank gebucht, sobald du wieder online bist.`;
      return;
    }
    this.checkingOut = true;
    this.successMessage = `${booked} in den Vorratsschrank gebucht.`;
    this.shoppingListApi.checkout(itemIds).subscribe({
      next: () => {
        this.checkingOut = false;
        itemIds.forEach((itemId) => this.checkedOutIds.delete(itemId));
        this.outbox.notifyBooked();
        void this.gamification.record('COMPLETE_SHOPPING', this.planId ? String(this.planId) : undefined);
      },
      error: () => {
        this.checkingOut = false;
        void this.outbox.queueCheckout(itemIds);
        this.successMessage = 'Verbindung gestört – der Einkauf wird automatisch nachgebucht.';
      },
    });
  }

  /** "1 Packung à 250 g" when the pantry will receive more than the recipe needs. */
  packHint(item: ShoppingListItem): string {
    if (!item.packSize || !item.purchaseQuantity || item.purchaseQuantity <= item.quantity) {
      return '';
    }
    const packs = Math.round(item.purchaseQuantity / item.packSize);
    return `${packs} × ${formatQuantity(item.packSize)} ${item.unit}`;
  }

  private get snapshotKey(): string {
    return this.hasPlanContext ? `shopping-list-plan-${this.planId}` : 'shopping-list';
  }

  private fetch() {
    return this.hasPlanContext ? this.shoppingListApi.getItems(this.planId) : this.shoppingListApi.getAllItems();
  }

  private applyServerItems(items: ShoppingListItem[]): void {
    const placeholders = this.items.filter((item) => item.id < 0);
    this.items = [...items.filter((item) => !this.checkedOutIds.has(item.id)), ...placeholders];
    this.saveSnapshot();
  }

  private saveSnapshot(): void {
    this.snapshots.write(this.snapshotKey, this.items.filter((item) => item.id > 0));
  }

  private readonly onVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      this.refreshInBackground();
    }
  };

  private refreshInBackground(): void {
    const busy = this.loading || this.generating || this.checkingOut || this.clearing
      || this.pendingToggles.size > 0 || this.items.some((item) => item.id < 0);
    if (busy || document.visibilityState !== 'visible' || !navigator.onLine) {
      return;
    }
    this.zone.run(() => {
      this.fetch().subscribe({
        next: (items) => {
          const visible = items.filter((item) => !this.checkedOutIds.has(item.id));
          if (this.pendingToggles.size === 0 && this.listState(visible) !== this.listState(this.items)) {
            this.applyServerItems(items);
          }
        },
        error: () => undefined,
      });
    });
  }

  private listState(items: ShoppingListItem[]): string {
    return items.map((item) => `${item.id}:${item.quantity}:${item.checked}`).join('|');
  }

  private listSignature(items: ShoppingListItem[]): string {
    return items.map((item) => `${item.id}:${item.quantity}`).sort().join('|');
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

  private cancelPendingToggle(itemId: number): void {
    const pending = this.pendingToggles.get(itemId);
    if (pending) {
      clearTimeout(pending.timer);
      this.pendingToggles.delete(itemId);
    }
  }
}

function categoryRank(category: string): number {
  const index = CATEGORY_ORDER.indexOf(category);
  return index === -1 ? CATEGORY_ORDER.length : index;
}

/** Same plain format as the quantities in the list (no thousands separator). */
function formatQuantity(value: number): string {
  return String(Math.round(value * 100) / 100);
}
