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

export type GamificationEventType =
  | 'COOK_DISH'
  | 'CREATE_RECIPE'
  | 'CREATE_PLAN'
  | 'COMPLETE_PLAN'
  | 'TRY_NEW_DISH'
  | 'COMPLETE_SHOPPING'
  | 'RATE_RECIPE'
  | 'PANTRY_MEAL'
  | 'OFFLINE_RECIPE_SYNCED'
  | 'CREATOR_RECIPE_COOKED';

export interface QueuedGamificationEvent {
  eventId: string;
  type: GamificationEventType;
  referenceId?: string;
  occurredAt: string;
}

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
