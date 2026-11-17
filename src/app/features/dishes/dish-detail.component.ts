import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DishApiService } from '../../core/dish-api.service';
import { AuthService, AuthenticatedUser } from '../../core/auth.service';
import { MealPlanApiService } from '../../core/meal-plan-api.service';
import { DishAvailability, DishDetail, DishIngredientEntry, Ingredient, IngredientAvailability, MealPlan } from '../../core/models';
import { ShareService } from '../../core/share.service';
import { GamificationService } from '../../core/gamification.service';
import { StarRatingComponent } from '../../shared/star-rating.component';
import { DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-dish-detail',
    templateUrl: './dish-detail.component.html',
    styleUrls: ['./dish-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterLink, StarRatingComponent, FormsModule, ReactiveFormsModule, DecimalPipe]
})
export class DishDetailComponent implements OnInit, OnDestroy {
  readonly ceil = Math.ceil;

  readonly ingredientForm = this.formBuilder.nonNullable.group({
    ingredientId: [0, [Validators.required, Validators.min(1)]],
    quantityGrams: [100, [Validators.required, Validators.min(1)]],
  });

  readonly nutritionForm = this.formBuilder.group({
    carbsGrams: this.formBuilder.control<number | null>(null),
    fatGrams: this.formBuilder.control<number | null>(null),
    vitaminAMcg: this.formBuilder.control<number | null>(null),
    vitaminCMg: this.formBuilder.control<number | null>(null),
    vitaminDMcg: this.formBuilder.control<number | null>(null),
    vitaminKMcg: this.formBuilder.control<number | null>(null),
    vitaminB12Mcg: this.formBuilder.control<number | null>(null),
    folateMcg: this.formBuilder.control<number | null>(null),
  });

  savingNutrition = false;
  advancePrepNote = '';
  costEur: number | null = null;
  savingCost = false;
  savingAdvancePrep = false;

  dishId = 0;
  dish: DishDetail | null = null;
  ingredients: Ingredient[] = [];
  /** Stock check from the server; it matches ingredients regardless of spelling and unit. */
  availability: DishAvailability | null = null;
  plans: MealPlan[] = [];
  planPickerOpen = false;
  selectedPlanId: number | null = null;
  addingToPlan = false;
  cooking = false;
  actionMessage = '';
  currentUser: AuthenticatedUser | null = null;
  loading = true;
  errorMessage = '';
  savingIngredient = false;
  savingFavorite = false;
  addingMissingIngredients = false;
  successMessage = '';
  shareMessage = '';
  selectedServings = 1;
  cookingModeActive = false;
  activeStepIndex = 0;
  activeTimerStepId: number | null = null;
  timerSecondsLeft = 0;
  private timerHandle: ReturnType<typeof setInterval> | null = null;
  private availabilityTimer: ReturnType<typeof setTimeout> | null = null;
  private startCookingWhenLoaded = false;
  private ingredientsRequested = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly mealPlanApi: MealPlanApiService,
    private readonly shareService: ShareService,
    private readonly gamification: GamificationService,
    readonly dishApi: DishApiService,
  ) {}

  ngOnInit(): void {
    this.dishId = Number(this.route.snapshot.paramMap.get('dishId'));
    const query = this.route.snapshot.queryParamMap;
    // "Jetzt kochen" from the plan or a suggestion lands directly in the cooking mode.
    this.startCookingWhenLoaded = query.has('cook');
    const planId = Number(query.get('plan'));
    if (planId > 0) {
      this.selectedPlanId = planId;
      this.planPickerOpen = true;
      this.loadPlans();
    }
    this.authService.getCurrentUser().subscribe({
      next: (user) => (this.currentUser = user),
      error: () => (this.currentUser = null),
    });
    this.load();
  }

  ngOnDestroy(): void {
    this.stopTimer();
    if (this.availabilityTimer) {
      clearTimeout(this.availabilityTimer);
    }
  }

  /** The ingredient catalog is only needed for editing the recipe. */
  loadIngredients(): void {
    if (this.ingredientsRequested) {
      return;
    }
    this.ingredientsRequested = true;
    this.dishApi.getIngredients().subscribe({
      next: (ingredients) => (this.ingredients = ingredients),
      error: () => (this.ingredientsRequested = false),
    });
  }

  stock(index: number): IngredientAvailability | null {
    return this.availability?.ingredients[index] ?? null;
  }

  get missingCount(): number {
    return this.availability?.ingredients.filter((ingredient) => ingredient.missing > 0).length ?? 0;
  }

  /** Ingredients that are neither at home nor on the shopping list yet. */
  get uncoveredCount(): number {
    return this.availability?.ingredients.filter((ingredient) => ingredient.uncovered > 0).length ?? 0;
  }

  scaledQuantity(ingredient: DishIngredientEntry): number {
    if (!this.dish || this.dish.servings <= 0) {
      return ingredient.quantityGrams;
    }
    return ingredient.quantityGrams * this.selectedServings / this.dish.servings;
  }

  changeServings(delta: number): void {
    this.selectedServings = Math.max(1, Math.min(24, this.selectedServings + delta));
    // Several taps in a row only ask the server once.
    if (this.availabilityTimer) {
      clearTimeout(this.availabilityTimer);
    }
    this.availabilityTimer = setTimeout(() => this.loadAvailability(), 250);
  }

  loadAvailability(): void {
    if (!this.dish?.ingredients.length) {
      this.availability = null;
      return;
    }
    const servings = this.selectedServings;
    this.dishApi.getAvailability(this.dishId, servings).subscribe({
      next: (availability) => {
        if (servings === this.selectedServings) {
          this.availability = availability;
        }
      },
      error: () => (this.availability = null),
    });
  }

  addMissingIngredientsToCart(): void {
    const missing = this.uncoveredCount;
    if (missing === 0 || this.addingMissingIngredients) {
      return;
    }
    this.addingMissingIngredients = true;
    this.successMessage = '';
    this.dishApi.addMissingToShoppingList(this.dishId, this.selectedServings).subscribe({
      next: () => {
        this.successMessage = `${missing} ${missing === 1 ? 'Zutat steht' : 'Zutaten stehen'} auf der Einkaufsliste.`;
        this.addingMissingIngredients = false;
        this.loadAvailability();
      },
      error: () => {
        this.errorMessage = 'Die fehlenden Zutaten konnten nicht hinzugefügt werden.';
        this.addingMissingIngredients = false;
      },
    });
  }

  /**
   * Marks the dish as cooked from here: the pantry is reduced, and if the dish is coming up in the
   * plan the rotation moves on, otherwise it counts as a spontaneous meal.
   */
  cook(): void {
    if (!this.dish || this.cooking) {
      return;
    }
    const name = this.dish.name;
    this.cooking = true;
    this.actionMessage = '';
    this.errorMessage = '';
    this.dishApi.cook(this.dishId, this.selectedServings).subscribe({
      next: () => {
        this.cooking = false;
        this.closeCookingMode();
        this.actionMessage = `${name} ist als gekocht gespeichert – der Vorrat wurde angepasst.`;
        void this.gamification.record('COOK_DISH', String(this.dishId));
        this.loadAvailability();
      },
      error: () => {
        this.cooking = false;
        this.errorMessage = 'Das Gericht konnte nicht als gekocht gespeichert werden.';
      },
    });
  }

  onPlanPickerToggle(event: Event): void {
    this.planPickerOpen = (event.target as HTMLDetailsElement).open;
    if (this.planPickerOpen) {
      this.loadPlans();
    }
  }

  addToPlan(): void {
    const plan = this.plans.find((entry) => entry.id === Number(this.selectedPlanId));
    if (!plan || this.addingToPlan) {
      return;
    }
    this.addingToPlan = true;
    this.actionMessage = '';
    this.mealPlanApi.addEntry(plan.id, this.dishId).subscribe({
      next: () => {
        this.addingToPlan = false;
        this.planPickerOpen = false;
        this.actionMessage = `Zum Plan „${plan.name}“ hinzugefügt.`;
      },
      error: () => {
        this.addingToPlan = false;
        this.errorMessage = 'Das Gericht konnte nicht zum Plan hinzugefügt werden.';
      },
    });
  }

  private loadPlans(): void {
    if (this.plans.length) {
      return;
    }
    this.mealPlanApi.getPlans().subscribe({
      next: (plans) => {
        this.plans = plans;
        const preselected = plans.find((plan) => plan.id === this.selectedPlanId);
        this.selectedPlanId = (preselected ?? plans.find((plan) => plan.active) ?? plans[0])?.id ?? null;
      },
      error: () => (this.errorMessage = 'Die Pläne konnten nicht geladen werden.'),
    });
  }

  load(): void {
    this.loading = true;
    this.dishApi.getDish(this.dishId).subscribe({
      next: (dish) => {
        this.dish = dish;
        this.selectedServings = dish.servings;
        this.advancePrepNote = dish.advancePrepNote ?? '';
        this.costEur = dish.costEur ?? null;
        this.nutritionForm.setValue({
          carbsGrams: dish.carbsGrams,
          fatGrams: dish.fatGrams,
          vitaminAMcg: dish.vitaminAMcg,
          vitaminCMg: dish.vitaminCMg,
          vitaminDMcg: dish.vitaminDMcg,
          vitaminKMcg: dish.vitaminKMcg,
          vitaminB12Mcg: dish.vitaminB12Mcg,
          folateMcg: dish.folateMcg,
        });
        this.loading = false;
        this.loadAvailability();
        if (this.startCookingWhenLoaded) {
          this.startCookingWhenLoaded = false;
          this.startCookingMode();
        }
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

  rate(stars: number): void {
    if (!this.dish) {
      return;
    }

    this.dishApi.rateDish(this.dishId, stars).subscribe({
      next: (summary) => {
        void this.gamification.record('RATE_RECIPE', String(this.dishId));
        if (this.dish) {
          this.dish.averageRating = summary.averageRating;
          this.dish.ratingCount = summary.ratingCount;
          this.dish.myRating = summary.myRating;
        }
      },
      error: () => {
        this.errorMessage = 'Die Bewertung konnte nicht gespeichert werden.';
      },
    });
  }

  toggleFavorite(): void {
    if (!this.dish || this.savingFavorite) {
      return;
    }
    this.savingFavorite = true;
    this.dishApi.setFavorite(this.dishId, !this.dish.favorite).subscribe({
      next: ({ favorite }) => {
        if (this.dish) {
          this.dish.favorite = favorite;
        }
        this.savingFavorite = false;
      },
      error: () => {
        this.errorMessage = 'Das Kochbuch konnte nicht aktualisiert werden.';
        this.savingFavorite = false;
      },
    });
  }

  saveCost(): void {
    if (this.savingCost || (this.costEur !== null && this.costEur < 0)) {
      return;
    }
    this.savingCost = true;
    this.dishApi.updateCost(this.dishId, this.costEur).subscribe({
      next: ({ costEur }) => {
        if (this.dish) {
          this.dish.costEur = costEur;
        }
        this.savingCost = false;
      },
      error: () => {
        this.errorMessage = 'Die Kosten konnten nicht gespeichert werden.';
        this.savingCost = false;
      },
    });
  }

  saveAdvancePrep(): void {
    if (this.savingAdvancePrep) {
      return;
    }
    this.savingAdvancePrep = true;
    this.dishApi.updateAdvancePrep(this.dishId, this.advancePrepNote.trim() || null).subscribe({
      next: ({ note }) => {
        if (this.dish) {
          this.dish.advancePrepNote = note;
        }
        this.savingAdvancePrep = false;
      },
      error: () => {
        this.errorMessage = 'Der Vorbereitungs-Hinweis konnte nicht gespeichert werden.';
        this.savingAdvancePrep = false;
      },
    });
  }

  saveNutrition(): void {
    if (this.savingNutrition) {
      return;
    }
    this.savingNutrition = true;
    this.dishApi.updateNutrition(this.dishId, this.nutritionForm.getRawValue()).subscribe({
      next: (nutrition) => {
        if (this.dish) {
          Object.assign(this.dish, nutrition);
        }
        this.savingNutrition = false;
      },
      error: () => {
        this.errorMessage = 'Die Nährwerte konnten nicht gespeichert werden.';
        this.savingNutrition = false;
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

  startCookingMode(): void {
    if (!this.dish?.steps.length) {
      return;
    }
    this.activeStepIndex = 0;
    this.cookingModeActive = true;
  }

  closeCookingMode(): void {
    this.stopTimer();
    this.cookingModeActive = false;
  }

  previousStep(): void {
    this.stopTimer();
    this.activeStepIndex = Math.max(0, this.activeStepIndex - 1);
  }

  nextStep(): void {
    if (!this.dish) {
      return;
    }
    this.stopTimer();
    this.activeStepIndex = Math.min(this.dish.steps.length - 1, this.activeStepIndex + 1);
  }

  stopTimer(): void {
    if (this.timerHandle) {
      clearInterval(this.timerHandle);
      this.timerHandle = null;
    }
    this.activeTimerStepId = null;
    this.timerSecondsLeft = 0;
  }

  async shareDish(): Promise<void> {
    if (!this.dish) {
      return;
    }
    this.shareMessage = '';
    try {
      const result = await this.shareService.share(
        this.dish.name,
        `Schau dir das Gericht ${this.dish.name} an.`,
      );
      if (result === 'copied') {
        this.shareMessage = 'Link zum Gericht kopiert.';
      }
    } catch {
      this.errorMessage = 'Der Link konnte nicht geteilt werden.';
    }
  }
}
