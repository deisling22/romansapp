import Dexie, { Table } from 'dexie';

export interface QueuedShoppingListUpdate {
  itemId: number;
  checked: boolean;
  queuedAt: number;
}

export interface LocalMealPlan {
  clientId: string;
  serverId?: number;
  name: string;
  updatedAt: number;
  syncedAt?: number;
}

export interface LocalDish {
  clientId: string;
  planClientId: string;
  serverId?: number;
  name: string;
  image?: Blob;
  imageUrl?: string;
  updatedAt: number;
  syncedAt?: number;
}

export class OfflineDatabase extends Dexie {
  shoppingListOutbox!: Table<QueuedShoppingListUpdate, number>;
  mealPlans!: Table<LocalMealPlan, string>;
  dishes!: Table<LocalDish, string>;

  constructor() {
    super('speiseplan-offline');
    this.version(1).stores({
      shoppingListOutbox: 'itemId, queuedAt',
    });
    this.version(2).stores({
      shoppingListOutbox: 'itemId, queuedAt',
      mealPlans: 'clientId, serverId, updatedAt',
      dishes: 'clientId, planClientId, serverId, updatedAt',
    });
  }
}

export const offlineDatabase = new OfflineDatabase();
