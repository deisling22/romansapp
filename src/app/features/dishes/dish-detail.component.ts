import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, switchMap } from 'rxjs';
import { DishApiService } from '../../core/dish-api.service';
import { AuthService, AuthenticatedUser } from '../../core/auth.service';
import { PantryApiService } from '../../core/pantry-api.service';
import { ShoppingListApiService } from '../../core/shopping-list-api.service';
import { DishDetail, DishIngredientEntry, Ingredient, PantryItem, ShoppingListItem } from '../../core/models';
import { ShareService } from '../../core/share.service';
import { GamificationService } from '../../core/gamification.service';

@Component({
    selector: 'app-dish-detail',
    templateUrl: './dish-detail.component.html',
    styleUrls: ['./dish-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DishDetailComponent implements OnInit {
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

  dishId = 0;
  dish: DishDetail | null = null;
  ingredients: Ingredient[] = [];
  pantryItems: PantryItem[] = [];
  cartItems: ShoppingListItem[] = [];
  pantryLoaded = false;
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

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly pantryApi: PantryApiService,
    private readonly shoppingListApi: ShoppingListApiService,
    private readonly shareService: ShareService,
    private readonly gamification: GamificationService,
    readonly dishApi: DishApiService,
  ) {}

  ngOnInit(): void {
    this.dishId = Number(this.route.snapshot.paramMap.get('dishId'));
    this.dishApi.getIngredients().subscribe({
      next: (ingredients) => (this.ingredients = ingredients),
    });
    this.authService.getCurrentUser().subscribe({
      next: (user) => (this.currentUser = user),
      error: () => (this.currentUser = null),
    });
    this.pantryApi.getItems().subscribe({
      next: (items) => {
        this.pantryItems = items;
        this.pantryLoaded = true;
      },
      error: () => (this.pantryLoaded = true),
    });
    this.shoppingListApi.getAllItems().subscribe({
      next: (items) => (this.cartItems = items),
    });
    this.load();
  }

  availableQuantity(ingredient: DishIngredientEntry): number {
    return this.pantryItems
      .filter((item) =>
        item.ingredientName.localeCompare(ingredient.ingredientName, undefined, { sensitivity: 'base' }) === 0
        && item.unit.localeCompare(ingredient.unit, undefined, { sensitivity: 'base' }) === 0)
      .reduce((total, item) => total + item.quantity, 0);
  }

  missingQuantity(ingredient: DishIngredientEntry): number {
    return Math.max(0, this.scaledQuantity(ingredient) - this.availableQuantity(ingredient));
  }

  scaledQuantity(ingredient: DishIngredientEntry): number {
    if (!this.dish || this.dish.servings <= 0) {
      return ingredient.quantityGrams;
    }
    return ingredient.quantityGrams * this.selectedServings / this.dish.servings;
  }

  changeServings(delta: number): void {
    this.selectedServings = Math.max(1, Math.min(24, this.selectedServings + delta));
  }

  cartQuantity(ingredient: DishIngredientEntry): number {
    return this.cartItems
      .filter((item) => !item.checked
        && item.ingredientName.localeCompare(ingredient.ingredientName, undefined, { sensitivity: 'base' }) === 0
        && item.unit.localeCompare(ingredient.unit, undefined, { sensitivity: 'base' }) === 0)
      .reduce((total, item) => total + item.quantity, 0);
  }

  quantityToAdd(ingredient: DishIngredientEntry): number {
    return Math.max(0, this.missingQuantity(ingredient) - this.cartQuantity(ingredient));
  }

  get missingIngredients(): DishIngredientEntry[] {
    if (!this.pantryLoaded) {
      return [];
    }
    return this.dish?.ingredients.filter((ingredient) => this.missingQuantity(ingredient) > 0) ?? [];
  }

  get ingredientsToAdd(): DishIngredientEntry[] {
    return this.missingIngredients.filter((ingredient) => this.quantityToAdd(ingredient) > 0);
  }

  addMissingIngredientsToCart(): void {
    const missing = this.ingredientsToAdd;
    if (missing.length === 0 || this.addingMissingIngredients) {
      return;
    }

    this.addingMissingIngredients = true;
    this.successMessage = '';
    forkJoin(missing.map((ingredient) => this.shoppingListApi.addItem(
      ingredient.ingredientName,
      this.quantityToAdd(ingredient),
      ingredient.unit,
    ))).pipe(
      switchMap(() => this.shoppingListApi.getAllItems()),
    ).subscribe({
      next: (items) => {
        this.cartItems = items;
        this.successMessage = `${missing.length} ${missing.length === 1 ? 'Zutat wurde' : 'Zutaten wurden'} ergänzt.`;
        this.addingMissingIngredients = false;
      },
      error: () => {
        this.errorMessage = 'Die fehlenden Zutaten konnten nicht hinzugefügt werden.';
        this.addingMissingIngredients = false;
      },
    });
  }

  load(): void {
    this.loading = true;
    this.dishApi.getDish(this.dishId).subscribe({
      next: (dish) => {
        this.dish = dish;
        this.selectedServings = dish.servings;
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
