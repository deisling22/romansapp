import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DishApiService } from '../../core/dish-api.service';
import { DishDetail, Ingredient } from '../../core/models';

@Component({
    selector: 'app-dish-detail',
    templateUrl: './dish-detail.component.html',
    styleUrls: ['./dish-detail.component.scss'],
    standalone: false
})
export class DishDetailComponent implements OnInit {
  readonly ingredientForm = this.formBuilder.nonNullable.group({
    ingredientId: [0, [Validators.required, Validators.min(1)]],
    quantityGrams: [100, [Validators.required, Validators.min(1)]],
  });

  dishId = 0;
  dish: DishDetail | null = null;
  ingredients: Ingredient[] = [];
  loading = true;
  errorMessage = '';
  savingIngredient = false;
  activeTimerStepId: number | null = null;
  timerSecondsLeft = 0;
  private timerHandle: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    readonly dishApi: DishApiService,
  ) {}

  ngOnInit(): void {
    this.dishId = Number(this.route.snapshot.paramMap.get('dishId'));
    this.dishApi.getIngredients().subscribe({
      next: (ingredients) => (this.ingredients = ingredients),
    });
    this.load();
  }

  load(): void {
    this.loading = true;
    this.dishApi.getDish(this.dishId).subscribe({
      next: (dish) => {
        this.dish = dish;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Das Gericht konnte nicht geladen werden.';
        this.loading = false;
      },
    });
  }

  addIngredient(): void {
    if (this.ingredientForm.invalid || this.savingIngredient) {
      this.ingredientForm.markAllAsTouched();
      return;
    }

    const { ingredientId, quantityGrams } = this.ingredientForm.getRawValue();
    this.savingIngredient = true;
    this.dishApi.addIngredient(this.dishId, ingredientId, quantityGrams).subscribe({
      next: () => {
        this.savingIngredient = false;
        this.load();
      },
      error: () => {
        this.errorMessage = 'Die Zutat konnte nicht hinzugefügt werden.';
        this.savingIngredient = false;
      },
    });
  }

  startTimer(stepId: number, seconds: number): void {
    this.stopTimer();
    this.activeTimerStepId = stepId;
    this.timerSecondsLeft = seconds;
    this.timerHandle = setInterval(() => {
      this.timerSecondsLeft -= 1;
      if (this.timerSecondsLeft <= 0) {
        this.stopTimer();
      }
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerHandle) {
      clearInterval(this.timerHandle);
      this.timerHandle = null;
    }
    this.activeTimerStepId = null;
    this.timerSecondsLeft = 0;
  }
}
