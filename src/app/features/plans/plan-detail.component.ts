import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MealPlanApiService } from '../../core/meal-plan-api.service';
import { DashboardApiService } from '../../core/dashboard-api.service';
import { ShoppingListApiService } from '../../core/shopping-list-api.service';
import { Dish } from '../../core/models';

@Component({
    selector: 'app-plan-detail',
    templateUrl: './plan-detail.component.html',
    styleUrls: ['./plans.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PlanDetailComponent implements OnInit {
  dishes: Dish[] = [];
  planId = 0;
  loading = true;
  errorMessage = '';
  cookingDishId: number | null = null;
  addingToCart = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dashboardApi: DashboardApiService,
    private readonly shoppingListApi: ShoppingListApiService,
    readonly mealPlanApi: MealPlanApiService,
  ) {}

  ngOnInit(): void {
    this.planId = Number(this.route.snapshot.paramMap.get('planId'));
    this.load();
  }

  load(): void {
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
}
