import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MealPlanApiService } from '../../core/meal-plan-api.service';
import { MealPlan } from '../../core/models';

@Component({
    selector: 'app-plan-list',
    templateUrl: './plan-list.component.html',
    styleUrls: ['./plans.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PlanListComponent implements OnInit {
  plans: MealPlan[] = [];
  loading = true;
  errorMessage = '';
  newPlanName = '';
  creating = false;

  constructor(private readonly mealPlanApi: MealPlanApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
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

  createPlan(): void {
    const name = this.newPlanName.trim();
    if (!name || this.creating) {
      return;
    }

    this.creating = true;
    this.mealPlanApi.createPlan(name).subscribe({
      next: () => {
        this.newPlanName = '';
        this.creating = false;
        this.load();
      },
      error: () => {
        this.errorMessage = 'Der Plan konnte nicht erstellt werden.';
        this.creating = false;
      },
    });
  }

  copyPlan(plan: MealPlan, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.mealPlanApi.copyPlan(plan.id).subscribe({
      next: () => this.load(),
      error: () => {
        this.errorMessage = 'Der Plan konnte nicht kopiert werden.';
      },
    });
  }

  deletePlan(plan: MealPlan, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!confirm(`Plan "${plan.name}" wirklich löschen?`)) {
      return;
    }
    this.mealPlanApi.deletePlan(plan.id).subscribe({
      next: () => this.load(),
      error: () => {
        this.errorMessage = 'Der Plan konnte nicht gelöscht werden.';
      },
    });
  }
}
