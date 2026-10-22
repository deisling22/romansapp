import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { ConnectivityService } from './connectivity.service';
import { LocalDish, LocalMealPlan, openOfflineDatabase } from './offline-db';

interface SyncDishResponse {
  serverId: number;
  clientId: string;
  name: string;
  imageUrl: string;
  updatedAt: string;
}

interface SyncPlanResponse {
  serverId: number;
  clientId: string;
  name: string;
  updatedAt: string;
  dishes: SyncDishResponse[];
}

@Injectable({ providedIn: 'root' })
export class RecipeSyncService {
  private syncing = false;

  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthService,
    private readonly connectivity: ConnectivityService,
  ) {
    this.connectivity.online$.subscribe((online) => {
      if (online) {
        void this.sync();
      }
    });
  }

  async listPlans(): Promise<LocalMealPlan[]> {
    const db = await openOfflineDatabase();
    return db.mealPlans.orderBy('updatedAt').reverse().toArray();
  }

  async getPlan(clientId: string): Promise<LocalMealPlan | undefined> {
    const db = await openOfflineDatabase();
    return db.mealPlans.get(clientId);
  }

  async listDishes(planClientId: string): Promise<LocalDish[]> {
    const db = await openOfflineDatabase();
    return db.dishes.where('planClientId').equals(planClientId).sortBy('updatedAt');
  }

  async createPlan(name: string): Promise<LocalMealPlan> {
    const plan: LocalMealPlan = {
      clientId: crypto.randomUUID(),
      name: name.trim(),
      updatedAt: Date.now(),
    };
    await (await openOfflineDatabase()).mealPlans.add(plan);
    void this.sync();
    return plan;
  }

  async addDish(planClientId: string, name: string, image: Blob): Promise<LocalDish> {
    const db = await openOfflineDatabase();
    if (!(await db.mealPlans.get(planClientId))) {
      throw new Error('Der lokale Plan wurde nicht gefunden.');
    }
    const dish: LocalDish = {
      clientId: crypto.randomUUID(),
      planClientId,
      name: name.trim(),
      image,
      updatedAt: Date.now(),
    };
    await db.transaction('rw', db.mealPlans, db.dishes, async () => {
      await db.dishes.add(dish);
      await db.mealPlans.update(planClientId, { updatedAt: dish.updatedAt, syncedAt: undefined });
    });
    void this.sync();
    return dish;
  }

  async deletePlan(clientId: string): Promise<void> {
    const db = await openOfflineDatabase();
    await db.transaction('rw', db.mealPlans, db.dishes, async () => {
      await db.dishes.where('planClientId').equals(clientId).delete();
      await db.mealPlans.delete(clientId);
    });
  }

  async sync(): Promise<void> {
    if (this.syncing || !this.connectivity.isOnline || !this.auth.getToken()) {
      return;
    }
    this.syncing = true;
    try {
      const plans = await (await openOfflineDatabase()).mealPlans.toArray();
      const requestPlans = await Promise.all(plans.map(async (plan) => {
        const dishes = await this.listDishes(plan.clientId);
        return {
          clientId: plan.clientId,
          name: plan.name,
          updatedAt: new Date(plan.updatedAt).toISOString(),
          dishes: await Promise.all(dishes.map(async (dish) => ({
            clientId: dish.clientId,
            name: dish.name,
            updatedAt: new Date(dish.updatedAt).toISOString(),
            imageDataUrl: dish.image && (!dish.syncedAt || dish.updatedAt > dish.syncedAt)
              ? await this.blobToDataUrl(dish.image)
              : null,
          }))),
        };
      }));
      const response = await firstValueFrom(
        this.http.post<SyncPlanResponse[]>(`${environment.apiUrl}/sync`, { plans: requestPlans }),
      );
      await this.merge(response);
    } catch {
      // Local data remains queued and the next login or online event retries the sync.
    } finally {
      this.syncing = false;
    }
  }

  private async merge(serverPlans: SyncPlanResponse[]): Promise<void> {
    const db = await openOfflineDatabase();
    await db.transaction('rw', db.mealPlans, db.dishes, async () => {
      for (const serverPlan of serverPlans) {
        const serverUpdatedAt = Date.parse(serverPlan.updatedAt);
        const localPlan = await db.mealPlans.get(serverPlan.clientId);
        await db.mealPlans.put({
          clientId: serverPlan.clientId,
          serverId: serverPlan.serverId,
          name: !localPlan || serverUpdatedAt >= localPlan.updatedAt ? serverPlan.name : localPlan.name,
          updatedAt: Math.max(serverUpdatedAt, localPlan?.updatedAt ?? 0),
          syncedAt: Date.now(),
        });
        for (const serverDish of serverPlan.dishes) {
          const serverDishUpdatedAt = Date.parse(serverDish.updatedAt);
          const localDish = await db.dishes.get(serverDish.clientId);
          await db.dishes.put({
            clientId: serverDish.clientId,
            planClientId: serverPlan.clientId,
            serverId: serverDish.serverId,
            name: !localDish || serverDishUpdatedAt >= localDish.updatedAt ? serverDish.name : localDish.name,
            image: localDish?.image,
            imageUrl: serverDish.imageUrl,
            updatedAt: Math.max(serverDishUpdatedAt, localDish?.updatedAt ?? 0),
            syncedAt: Date.now(),
          });
        }
      }
    });
  }

  private blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }
}