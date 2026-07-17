import Dexie, { Table } from 'dexie';

export interface QueuedShoppingListUpdate {
  itemId: number;
  checked: boolean;
  queuedAt: number;
}

export class OfflineDatabase extends Dexie {
  shoppingListOutbox!: Table<QueuedShoppingListUpdate, number>;

  constructor() {
    super('speiseplan-offline');
    this.version(1).stores({
      shoppingListOutbox: 'itemId, queuedAt',
    });
  }
}

export const offlineDatabase = new OfflineDatabase();
