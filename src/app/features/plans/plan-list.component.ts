import { Component, OnInit } from '@angular/core';
import { MealPlanApiService } from '../../core/meal-plan-api.service';
import { MealPlan } from '../../core/models';

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plans.scss'],
})
export class PlanListComponent implements OnInit {
  plans: MealPlan[] = [];
  loading = true;
  errorMessage = '';

  constructor(private readonly mealPlanApi: MealPlanApiService) {}

  ngOnInit(): void {
    this.mealPlanApi.getPlans().subscribe({
      next: (plans) => {
        this.plans = plans;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Die Pläne konnten nicht geladen werden. Ist das Backend gestartet?';
        this.loading = false;
      },
    });
  }
}