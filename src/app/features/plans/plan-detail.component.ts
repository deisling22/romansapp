import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MealPlanApiService } from '../../core/meal-plan-api.service';
import { Dish } from '../../core/models';

@Component({
  selector: 'app-plan-detail',
  templateUrl: './plan-detail.component.html',
  styleUrls: ['./plans.scss'],
})
export class PlanDetailComponent implements OnInit {
  dishes: Dish[] = [];
  planId = 0;
  loading = true;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    readonly mealPlanApi: MealPlanApiService,
  ) {}

  ngOnInit(): void {
    this.planId = Number(this.route.snapshot.paramMap.get('planId'));
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
}