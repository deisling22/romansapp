import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MealPlanApiService } from '../../core/meal-plan-api.service';
import { DashboardApiService } from '../../core/dashboard-api.service';
import { ShoppingListApiService } from '../../core/shopping-list-api.service';
import { Dish } from '../../core/models';
import { ShareService } from '../../core/share.service';
import { RecipeSyncService } from '../../core/recipe-sync.service';

@Component({
    selector: 'app-plan-detail',
    templateUrl: './plan-detail.component.html',
    styleUrls: ['./plans.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PlanDetailComponent implements OnInit, OnDestroy {
  dishes: Dish[] = [];
  planId = 0;
  loading = true;
  errorMessage = '';
  cookingDishId: number | null = null;
  addingToCart = false;
  shareMessage = '';
  localClientId = '';
  localPlanName = '';
  private readonly localImageUrls: string[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dashboardApi: DashboardApiService,
    private readonly shoppingListApi: ShoppingListApiService,
    private readonly shareService: ShareService,
    private readonly recipeSync: RecipeSyncService,
    readonly mealPlanApi: MealPlanApiService,
  ) {}

  ngOnInit(): void {
    this.localClientId = this.route.snapshot.paramMap.get('clientId') ?? '';
    if (this.localClientId) {
      void this.loadLocal();
      return;
    }
    this.planId = Number(this.route.snapshot.paramMap.get('planId'));
    this.load();
  }

  ngOnDestroy(): void {
    for (const imageUrl of this.localImageUrls) {
      URL.revokeObjectURL(imageUrl);
    }
  }

  get isLocal(): boolean {
    return Boolean(this.localClientId);
  }

  load(): void {
    if (this.isLocal) {
      void this.loadLocal();
      return;
    }
    this.loading = true;
    this.mealPlanApi.getDishes(this.planId).subscribe({
      next: (dishes) => {
        this.dishes = dishes;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Die Gerichte dieses Plans konnten nicht geladen werden.';
        this.loading = false;
      },
    });
  }

  private async loadLocal(): Promise<void> {
    this.loading = true;
    const [plan, localDishes] = await Promise.all([
      this.recipeSync.getPlan(this.localClientId),
      this.recipeSync.listDishes(this.localClientId),
    ]);
    if (!plan) {
      this.errorMessage = 'Der lokale Plan wurde nicht gefunden.';
      this.loading = false;
      return;
    }
    this.localPlanName = plan.name;
    this.dishes = localDishes.map((dish, index) => {
      const imageUrl = dish.image ? URL.createObjectURL(dish.image) : dish.imageUrl ?? '';
      if (dish.image) {
        this.localImageUrls.push(imageUrl);
      }
      return {
        id: -(index + 1),
        name: dish.name,
        imageUrl,
        sortOrder: index,
        planEntryId: 0,
        cooked: false,
      };
    });
    this.loading = false;
  }

  markCooked(dish: Dish): void {
    if (this.cookingDishId) {
      return;
    }
    this.cookingDishId = dish.id;
    this.dashboardApi.markCooked(dish.planEntryId).subscribe({
      next: () => {
        this.cookingDishId = null;
        this.load();
      },
      error: () => {
        this.errorMessage = 'Das Gericht konnte nicht als gekocht markiert werden.';
        this.cookingDishId = null;
      },
    });
  }

  addIngredientsToCart(): void {
    if (this.addingToCart || this.dishes.length === 0) {
      return;
    }
    this.addingToCart = true;
    this.errorMessage = '';
    this.shoppingListApi.generate(this.planId).subscribe({
      next: () => {
        void this.router.navigate(['/shopping-list']);
      },
      error: () => {
        this.errorMessage = 'Die Zutaten konnten nicht in den Warenkorb gelegt werden.';
        this.addingToCart = false;
      },
    });
  }

  async sharePlan(): Promise<void> {
    this.shareMessage = '';
    try {
      const result = await this.shareService.share(
        'Speiseplan',
        'Schau dir diesen Speiseplan an.',
      );
      if (result === 'copied') {
        this.shareMessage = 'Link zum Plan kopiert.';
      }
    } catch {
      this.errorMessage = 'Der Link konnte nicht geteilt werden.';
    }
  }
}
