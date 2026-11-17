import { Injectable } from '@angular/core';
import { Subject, firstValueFrom } from 'rxjs';
import { openOfflineDatabase } from './offline-db';
import { ConnectivityService } from './connectivity.service';
import { ShoppingListApiService } from './shopping-list-api.service';

const RETRY_DELAY_MS = 30_000;

/** Shopping happens where the connection is worst: ticks and the final checkout are queued and replayed. */
@Injectable({ providedIn: 'root' })
export class ShoppingListOutboxService {
  private readonly bookedSubject = new Subject<void>();
  /** A purchase reached the pantry; screens showing stock reload on this. */
  readonly booked$ = this.bookedSubject.asObservable();
  private syncing = false;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly connectivity: ConnectivityService,
    private readonly shoppingListApi: ShoppingListApiService,
  ) {
    this.connectivity.online$.subscribe((online) => {
      if (online) {
        void this.flush();
      }
    });
  }

  notifyBooked(): void {
    this.bookedSubject.next();
  }

  async queue(itemId: number, checked: boolean): Promise<void> {
    const db = await openOfflineDatabase();
    await db.shoppingListOutbox.put({ itemId, checked, queuedAt: Date.now() });
  }

  /** The purchase is booked into the pantry as soon as the backend is reachable again. */
  async queueCheckout(itemIds: number[]): Promise<void> {
    const db = await openOfflineDatabase();
    // The checkout carries the item ids itself, so pending ticks for them are obsolete.
    await db.shoppingListOutbox.bulkDelete(itemIds);
    await db.checkoutOutbox.add({ itemIds, queuedAt: Date.now() });
    this.scheduleRetry();
  }

  async pendingCount(): Promise<number> {
    const db = await openOfflineDatabase();
    return (await db.shoppingListOutbox.count()) + (await db.checkoutOutbox.count());
  }

  async flush(): Promise<void> {
    if (this.syncing || !this.connectivity.isOnline) {
      return;
    }
    this.syncing = true;
    try {
      const db = await openOfflineDatabase();
      for (const entry of await db.shoppingListOutbox.toArray()) {
        try {
          await firstValueFrom(this.shoppingListApi.updateItem(entry.itemId, entry.checked));
          await db.shoppingListOutbox.delete(entry.itemId);
        } catch {
          // keep entry queued, retry on next reconnect
        }
      }
      for (const checkout of await db.checkoutOutbox.orderBy('queuedAt').toArray()) {
        try {
          await firstValueFrom(this.shoppingListApi.checkout(checkout.itemIds));
          await db.checkoutOutbox.delete(checkout.id!);
          this.bookedSubject.next();
        } catch {
          // keep the purchase queued, retry on next reconnect
        }
      }
      // "Online" does not guarantee a reachable backend (supermarket, sleeping server): try again later.
      if ((await db.shoppingListOutbox.count()) + (await db.checkoutOutbox.count()) > 0) {
        this.scheduleRetry();
      }
    } finally {
      this.syncing = false;
    }
  }

  private scheduleRetry(): void {
    if (this.retryTimer === null) {
      this.retryTimer = setTimeout(() => {
        this.retryTimer = null;
        void this.flush();
      }, RETRY_DELAY_MS);
    }
  }
}
