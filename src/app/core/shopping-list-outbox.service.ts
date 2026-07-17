import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { offlineDatabase } from './offline-db';
import { ConnectivityService } from './connectivity.service';
import { ShoppingListApiService } from './shopping-list-api.service';

@Injectable({ providedIn: 'root' })
export class ShoppingListOutboxService {
  private syncing = false;

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

  async queue(itemId: number, checked: boolean): Promise<void> {
    await offlineDatabase.shoppingListOutbox.put({ itemId, checked, queuedAt: Date.now() });
  }

  async pendingCount(): Promise<number> {
    return offlineDatabase.shoppingListOutbox.count();
  }

  async flush(): Promise<void> {
    if (this.syncing || !this.connectivity.isOnline) {
      return;
    }
    this.syncing = true;
    try {
      const queued = await offlineDatabase.shoppingListOutbox.toArray();
      for (const entry of queued) {
        try {
          await firstValueFrom(this.shoppingListApi.updateItem(entry.itemId, entry.checked));
          await offlineDatabase.shoppingListOutbox.delete(entry.itemId);
        } catch {
          // keep entry queued, retry on next reconnect
        }
      }
    } finally {
      this.syncing = false;
    }
  }
}
