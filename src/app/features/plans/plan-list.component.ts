import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { MealPlanApiService } from '../../core/meal-plan-api.service';
import { MealPlan } from '../../core/models';
import { LocalMealPlan } from '../../core/offline-db';
import { RecipeSyncService } from '../../core/recipe-sync.service';
import { GamificationService } from '../../core/gamification.service';
import { ScheduleApiService } from '../../core/schedule-api.service';
import { SnapshotCacheService } from '../../core/snapshot-cache.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

const PLANS_SNAPSHOT = 'plans';

@Component({
    selector: 'app-plan-list',
    templateUrl: './plan-list.component.html',
    styleUrls: ['./plans.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FormsModule, RouterLink]
})
export class PlanListComponent implements OnInit {
  plans: MealPlan[] = [];
  localPlans: LocalMealPlan[] = [];
  loading = true;
  errorMessage = '';
  newPlanName = '';
  creating = false;
  busyPlanId: number | null = null;
  readonly savingPlanIds = new Set<number>();
  private readonly snapshots = inject(SnapshotCacheService);

  constructor(
    private readonly mealPlanApi: MealPlanApiService,
    private readonly recipeSync: RecipeSyncService,
    private readonly gamification: GamificationService,
    private readonly scheduleApi: ScheduleApiService,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    // The last known list is shown at once and replaced by the server answer.
    const snapshot = this.plans.length ? null : this.snapshots.read<MealPlan[]>(PLANS_SNAPSHOT);
    if (snapshot) {
      this.plans = snapshot;
    }
    this.loading = this.plans.length === 0;
    this.errorMessage = '';
    void this.loadLocalPlans();
    this.mealPlanApi.getPlans().subscribe({
      next: (plans) => {
        this.plans = plans;
        this.loading = false;
        this.snapshots.write(PLANS_SNAPSHOT, plans);
      },
      error: () => {
        this.errorMessage = 'Serverpläne sind gerade nicht erreichbar. Lokale Pläne bleiben verfügbar.';
        this.loading = false;
      },
    });
  }

  async createPlan(): Promise<void> {
    const name = this.newPlanName.trim();
    if (!name || this.creating) {
      return;
    }

    this.creating = true;
    try {
      const plan = await this.recipeSync.createPlan(name);
      await this.gamification.record('CREATE_PLAN', plan.clientId);
      this.newPlanName = '';
      await this.loadLocalPlans();
    } catch {
      this.errorMessage = 'Der Plan konnte nicht lokal gespeichert werden.';
    } finally {
      this.creating = false;
    }
  }

  async deleteLocalPlan(plan: LocalMealPlan, event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    if (!confirm(`Plan "${plan.name}" wirklich lokal löschen?`)) {
      return;
    }
    await this.recipeSync.deletePlan(plan.clientId);
    await this.loadLocalPlans();
  }

  private async loadLocalPlans(): Promise<void> {
    this.localPlans = await this.recipeSync.listPlans();
  }

  toggleActive(plan: MealPlan, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.busyPlanId === plan.id || this.savingPlanIds.has(plan.id)) {
      return;
    }
    const previousActive = plan.active;
    const active = !previousActive;
    this.errorMessage = '';
    this.savingPlanIds.add(plan.id);
    this.plans = this.plans.map((entry) => entry.id === plan.id ? { ...entry, active } : entry);
    this.scheduleApi.updatePlanSettings(plan.id, { active }).subscribe({
      next: (updated) => {
        this.plans = this.plans.map((entry) => (entry.id === updated.id ? updated : entry));
        this.savingPlanIds.delete(plan.id);
      },
      error: () => {
        this.plans = this.plans.map((entry) => entry.id === plan.id ? { ...entry, active: previousActive } : entry);
        this.errorMessage = `Der Plan „${plan.name}“ konnte nicht ${active ? 'aktiviert' : 'pausiert'} werden. Bitte erneut versuchen.`;
        this.savingPlanIds.delete(plan.id);
      },
    });
  }

  copyPlan(plan: MealPlan, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.busyPlanId !== null || this.savingPlanIds.has(plan.id)) {
      return;
    }
    this.busyPlanId = plan.id;
    this.mealPlanApi.copyPlan(plan.id).subscribe({
      next: () => {
        this.busyPlanId = null;
        this.load();
      },
      error: () => {
        this.errorMessage = 'Der Plan konnte nicht kopiert werden.';
        this.busyPlanId = null;
      },
    });
  }

  deletePlan(plan: MealPlan, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.busyPlanId !== null || this.savingPlanIds.has(plan.id) || !confirm(`Plan "${plan.name}" wirklich löschen?`)) {
      return;
    }
    this.busyPlanId = plan.id;
    this.mealPlanApi.deletePlan(plan.id).subscribe({
      next: () => {
        this.busyPlanId = null;
        this.load();
      },
      error: () => {
        this.errorMessage = 'Der Plan konnte nicht gelöscht werden.';
        this.busyPlanId = null;
      },
    });
  }
}
