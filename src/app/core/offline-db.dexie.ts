import Dexie, { Table } from 'dexie';
import type { LocalDish, LocalMealPlan, QueuedGamificationEvent, QueuedShoppingListUpdate } from './offline-db';

export class OfflineDatabase extends Dexie {
  shoppingListOutbox!: Table<QueuedShoppingListUpdate, number>;
  mealPlans!: Table<LocalMealPlan, string>;
  dishes!: Table<LocalDish, string>;
  gamificationOutbox!: Table<QueuedGamificationEvent, string>;

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
    this.version(3).stores({
      shoppingListOutbox: 'itemId, queuedAt',
      mealPlans: 'clientId, serverId, updatedAt',
      dishes: 'clientId, planClientId, serverId, updatedAt',
      gamificationOutbox: 'eventId, occurredAt, type',
    });
  }
}

export const offlineDatabase = new OfflineDatabase();
