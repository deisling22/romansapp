import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PantryApiService } from '../../core/pantry-api.service';
import { PantryItem, PantryRemovalReason, UseSoon } from '../../core/models';
import { parseQuickAdd } from '../../core/quick-add';
import { ShoppingListOutboxService } from '../../core/shopping-list-outbox.service';
import { SnapshotCacheService } from '../../core/snapshot-cache.service';
import { ExpiryInfo, expiryInfo } from './expiry';
import { UseSoonCardComponent } from './use-soon-card.component';

const SNAPSHOT_KEY = 'pantry';

@Component({
    selector: 'app-pantry',
    templateUrl: './pantry.component.html',
    styleUrls: ['./pantry.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        FormsModule,
        DatePipe,
        UseSoonCardComponent,
    ],
})
export class PantryComponent implements OnInit {
  items: PantryItem[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';
  quickAddText = '';
  adding = false;
  savingItemId: number | null = null;
  useSoon: UseSoon | null = null;

  constructor(
    private readonly pantryApi: PantryApiService,
    private readonly snapshots: SnapshotCacheService,
    private readonly outbox: ShoppingListOutboxService,
    private readonly destroyRef: DestroyRef,
  ) {}

  expiry(item: PantryItem): ExpiryInfo | null {
    return expiryInfo(item.expiresOn);
  }

  ngOnInit(): void {
    const snapshot = this.snapshots.read<PantryItem[]>(SNAPSHOT_KEY);
    if (snapshot) {
      this.items = snapshot;
      this.loading = false;
    }
    this.load();
    // A purchase may still be on its way when the user switches here right after shopping.
    this.outbox.booked$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.load());
  }

  load(): void {
    this.pantryApi.getItems().subscribe({
      next: (items) => {
        this.setItems(items);
        this.loading = false;
      },
      error: () => {
        if (this.loading) {
          this.errorMessage = 'Der Vorratsschrank konnte nicht geladen werden.';
        }
        this.loading = false;
      },
    });
    this.loadUseSoon();
  }

  loadUseSoon(): void {
    this.pantryApi.getUseSoon().subscribe({
      next: (useSoon) => (this.useSoon = useSoon),
      error: () => (this.useSoon = null),
    });
  }

  /** Manual entry for everything that did not come through the shopping list ("2 Zwiebeln", "Reis 1 kg"). */
  addItem(): void {
    const parsed = parseQuickAdd(this.quickAddText);
    if (!parsed || this.adding) {
      return;
    }
    this.adding = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.pantryApi.addBatch([parsed]).subscribe({
      next: (created) => {
        this.adding = false;
        this.quickAddText = '';
        this.setItems([...this.items, ...created]);
        this.successMessage = `${parsed.ingredientName} liegt jetzt im Vorrat.`;
        this.loadUseSoon();
      },
      error: () => {
        this.adding = false;
        this.errorMessage = 'Der Artikel konnte nicht gespeichert werden.';
      },
    });
  }

  setQuantity(item: PantryItem, value: string): void {
    const quantity = Number(value.replace(',', '.'));
    if (!(quantity > 0) || quantity === item.quantity) {
      return;
    }
    this.savingItemId = item.id;
    this.errorMessage = '';
    this.successMessage = '';
    this.pantryApi.updateQuantity(item.id, quantity).subscribe({
      next: (updated) => {
        this.setItems(this.items.map((entry) => (entry.id === updated.id ? updated : entry)));
        this.savingItemId = null;
        this.loadUseSoon();
      },
      error: () => {
        this.errorMessage = 'Die Menge konnte nicht gespeichert werden.';
        this.savingItemId = null;
      },
    });
  }

  setExpiry(item: PantryItem, value: string): void {
    const expiresOn = value || null;
    if (expiresOn === (item.expiresOn ?? null)) {
      return;
    }
    this.savingItemId = item.id;
    this.successMessage = '';
    this.pantryApi.updateExpiry(item.id, expiresOn).subscribe({
      next: (updated) => {
        this.setItems(this.items.map((entry) => (entry.id === updated.id ? updated : entry)));
        this.savingItemId = null;
        this.loadUseSoon();
      },
      error: () => {
        this.errorMessage = 'Das Ablaufdatum konnte nicht gespeichert werden.';
        this.savingItemId = null;
      },
    });
  }

  purchaseAgeLabel(purchasedAt: string): string {
    const purchased = new Date(purchasedAt);
    const today = new Date();
    purchased.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const days = Math.max(0, Math.round((today.getTime() - purchased.getTime()) / 86_400_000));
    if (days === 0) {
      return 'Heute gekauft';
    }
    if (days === 1) {
      return 'Gestern gekauft';
    }
    return `Vor ${days} Tagen gekauft`;
  }

  /** "Used up" and "thrown away" both empty the shelf, but only the latter counts as food waste. */
  remove(item: PantryItem, reason: PantryRemovalReason): void {
    const previous = this.items;
    this.setItems(this.items.filter((entry) => entry.id !== item.id));
    this.errorMessage = '';
    this.successMessage = reason === 'WASTED'
      ? `${item.ingredientName} als weggeworfen vermerkt.`
      : `${item.ingredientName} ist aufgebraucht.`;
    this.pantryApi.deleteItem(item.id, reason).subscribe({
      next: () => this.loadUseSoon(),
      error: () => {
        this.setItems(previous);
        this.successMessage = '';
        this.errorMessage = `${item.ingredientName} konnte nicht entfernt werden.`;
      },
    });
  }

  private setItems(items: PantryItem[]): void {
    this.items = [...items].sort((a, b) => (a.expiresOn ?? '9999').localeCompare(b.expiresOn ?? '9999'));
    this.snapshots.write(SNAPSHOT_KEY, this.items);
  }
}
