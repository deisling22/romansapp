import type { OfflineDatabase } from './offline-db.dexie';

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

let database: Promise<OfflineDatabase> | null = null;

// Dexie is loaded on first use so it stays out of the initial bundle.
export function openOfflineDatabase(): Promise<OfflineDatabase> {
  database ??= import('./offline-db.dexie').then((module) => module.offlineDatabase);
  return database;
}
