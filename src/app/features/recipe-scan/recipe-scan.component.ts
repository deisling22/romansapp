import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DishApiService } from '../../core/dish-api.service';
import { MealPlanApiService } from '../../core/meal-plan-api.service';
import { GamificationService } from '../../core/gamification.service';
import { Ingredient, MealPlan } from '../../core/models';
import { OcrProgress, RecipeOcrService } from './recipe-ocr.service';
import { ParsedIngredient, ParsedNutrition, ParsedStep, parseRecipeText } from './recipe-parser';

const HIGH_ACCURACY_ENABLED_KEY = 'recipeScan.highAccuracyEnabled';
const HIGH_ACCURACY_DOWNLOADED_KEY = 'recipeScan.highAccuracyDownloaded';
const CROP_ENABLED_KEY = 'recipeScan.manualCropEnabled';
const MIN_CROP_SIZE_PERCENT = 2;

const OCR_STATUS_LABELS: Record<string, string> = {
  'loading tesseract core': 'Texterkennung wird geladen ...',
  'initializing tesseract': 'Texterkennung wird initialisiert ...',
  'loading language traineddata': 'Sprachmodell wird heruntergeladen ...',
  'initializing api': 'Texterkennung wird vorbereitet ...',
  'recognizing text': 'Text wird erkannt ...',
};

@Component({
  selector: 'app-recipe-scan',
  templateUrl: './recipe-scan.component.html',
  styleUrls: ['./recipe-scan.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class RecipeScanComponent implements OnInit, OnDestroy {
  readonly units = [
    'Stk.',
    'g',
    'kg',
    'ml',
    'l',
    'EL',
    'TL',
    'Prise',
    'Bund',
    'Zehe',
    'Scheibe',
    'Dose',
    'Packung',
    'Becher',
    'Glas',
    'Blatt',
    'Stange',
  ];

  planId = 0;
  hasRoutePlanId = false;
  plans: MealPlan[] = [];
  loadingPlans = false;
  imageUrl = '';
  imageFile: File | null = null;
  analyzing = false;
  analyzed = false;
  saving = false;
  errorMessage = '';
  rawText = '';
  highAccuracy = localStorage.getItem(HIGH_ACCURACY_ENABLED_KEY) === '1';
  highAccuracyDownloaded = localStorage.getItem(HIGH_ACCURACY_DOWNLOADED_KEY) === '1';
  progress: { label: string; percent: number } | null = null;
  cropEnabled = localStorage.getItem(CROP_ENABLED_KEY) === '1';
  cropping = false;
  cropRect: { left: number; top: number; width: number; height: number } | null = null;
  private cropDragStart: { x: number; y: number } | null = null;

  @ViewChild('cropImage') private cropImageRef?: ElementRef<HTMLImageElement>;

  name = '';
  description = '';
  prepMinutes: number | null = null;
  servings = 1;
  tagsText = '';
  ingredients: ParsedIngredient[] = [];
  steps: ParsedStep[] = [];
  nutrition: ParsedNutrition = {
    carbsGrams: null,
    fatGrams: null,
    vitaminAMcg: null,
    vitaminCMg: null,
    vitaminDMcg: null,
    vitaminKMcg: null,
    vitaminB12Mcg: null,
    folateMcg: null,
  };

  private knownIngredients: Ingredient[] = [];
  private nextRowId = 1;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly ocr: RecipeOcrService,
    private readonly dishApi: DishApiService,
    private readonly mealPlanApi: MealPlanApiService,
    private readonly gamification: GamificationService,
  ) {}

  ngOnInit(): void {
    const routePlanId = Number(this.route.snapshot.paramMap.get('planId'));
    if (routePlanId) {
      this.planId = routePlanId;
      this.hasRoutePlanId = true;
    } else {
      this.loadingPlans = true;
      this.mealPlanApi.getPlans().subscribe({
        next: (plans) => {
          this.plans = plans;
          this.loadingPlans = false;
        },
        error: () => {
          this.errorMessage = 'Deine Pläne konnten nicht geladen werden.';
          this.loadingPlans = false;
        },
      });
    }

    this.dishApi.getIngredients().subscribe({
      next: (ingredients) => (this.knownIngredients = ingredients),
      error: () => undefined,
    });
  }

  ngOnDestroy(): void {
    this.releaseImage();
  }

  get backLink(): unknown[] {
    return this.hasRoutePlanId ? ['/plans', this.planId] : ['/'];
  }

  onHighAccuracyToggle(enabled: boolean): void {
    this.highAccuracy = enabled;
    localStorage.setItem(HIGH_ACCURACY_ENABLED_KEY, enabled ? '1' : '0');
  }

  onCropToggle(enabled: boolean): void {
    this.cropEnabled = enabled;
    localStorage.setItem(CROP_ENABLED_KEY, enabled ? '1' : '0');
  }

  onCropPointerDown(event: PointerEvent): void {
    const frame = event.currentTarget as HTMLElement;
    frame.setPointerCapture(event.pointerId);
    const point = this.cropPointFromEvent(event, frame);
    this.cropDragStart = point;
    this.cropRect = { left: point.x, top: point.y, width: 0, height: 0 };
    event.preventDefault();
  }

  onCropPointerMove(event: PointerEvent): void {
    if (!this.cropDragStart) {
      return;
    }
    const frame = event.currentTarget as HTMLElement;
    const point = this.cropPointFromEvent(event, frame);
    this.cropRect = {
      left: Math.min(this.cropDragStart.x, point.x),
      top: Math.min(this.cropDragStart.y, point.y),
      width: Math.abs(point.x - this.cropDragStart.x),
      height: Math.abs(point.y - this.cropDragStart.y),
    };
  }

  onCropPointerUp(): void {
    this.cropDragStart = null;
    if (this.cropRect && (this.cropRect.width < MIN_CROP_SIZE_PERCENT || this.cropRect.height < MIN_CROP_SIZE_PERCENT)) {
      this.cropRect = null;
    }
  }

  skipCrop(): void {
    this.cropping = false;
    this.cropRect = null;
    this.cropDragStart = null;
  }

  async confirmCrop(): Promise<void> {
    const image = this.cropImageRef?.nativeElement;
    if (!this.cropRect || !image || !this.imageFile) {
      return;
    }
    const sx = Math.round((this.cropRect.left / 100) * image.naturalWidth);
    const sy = Math.round((this.cropRect.top / 100) * image.naturalHeight);
    const sw = Math.round((this.cropRect.width / 100) * image.naturalWidth);
    const sh = Math.round((this.cropRect.height / 100) * image.naturalHeight);
    if (sw < 1 || sh < 1) {
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = sw;
    canvas.height = sh;
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }
    context.drawImage(image, sx, sy, sw, sh, 0, 0, sw, sh);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));
    if (!blob) {
      return;
    }

    const croppedFile = new File([blob], this.imageFile.name, { type: 'image/jpeg' });
    this.releaseImage();
    this.imageFile = croppedFile;
    this.imageUrl = URL.createObjectURL(croppedFile);
    this.cropping = false;
    this.cropRect = null;
  }

  private cropPointFromEvent(event: PointerEvent, frame: HTMLElement): { x: number; y: number } {
    const rect = frame.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    return { x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) };
  }

  selectImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!this.planId) {
      this.errorMessage = 'Bitte wähle zuerst einen Plan aus.';
      return;
    }
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Bitte wähle eine Bilddatei aus.';
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      this.errorMessage = 'Das Bild darf maximal 15 MB groß sein.';
      return;
    }

    this.releaseImage();
    this.imageFile = file;
    this.imageUrl = URL.createObjectURL(file);
    this.analyzed = false;
    this.errorMessage = '';
    this.cropping = this.cropEnabled;
    this.cropRect = null;
  }

  async analyze(): Promise<void> {
    if (!this.imageFile || this.analyzing || this.cropping) {
      return;
    }
    this.analyzing = true;
    this.errorMessage = '';
    this.progress = null;
    try {
      const quality = this.highAccuracy ? 'high-accuracy' : 'standard';
      this.rawText = await this.ocr.recognizeText(this.imageFile, quality, (update: OcrProgress) => {
        this.progress = {
          label: OCR_STATUS_LABELS[update.status] ?? update.status,
          percent: Math.round(update.progress * 100),
        };
      });
      if (quality === 'high-accuracy' && !this.highAccuracyDownloaded) {
        this.highAccuracyDownloaded = true;
        localStorage.setItem(HIGH_ACCURACY_DOWNLOADED_KEY, '1');
      }
      const parsed = parseRecipeText(this.rawText);
      this.name = parsed.name ?? '';
      this.description = parsed.description ?? '';
      this.prepMinutes = parsed.prepMinutes;
      this.servings = parsed.servings ?? 1;
      this.tagsText = parsed.tags.join(', ');
      this.ingredients = parsed.ingredients;
      this.steps = parsed.steps;
      this.nutrition = parsed.nutrition;
      this.nextRowId = parsed.ingredients.length + parsed.steps.length + 1;
      this.analyzed = true;
      if (!this.rawText.trim()) {
        this.errorMessage = 'Im Bild wurde kein Text erkannt. Versuche ein schärferes Foto.';
      }
    } catch (error) {
      console.error('Recipe scan failed', error);
      this.errorMessage = 'Die Texterkennung konnte nicht gestartet werden. Versuche es erneut.';
    } finally {
      this.analyzing = false;
      this.progress = null;
    }
  }

  addIngredient(): void {
    this.ingredients = [...this.ingredients, { id: this.nextRowId++, name: '', quantity: null, unit: 'Stk.' }];
  }

  removeIngredient(id: number): void {
    this.ingredients = this.ingredients.filter((ingredient) => ingredient.id !== id);
  }

  addStep(): void {
    this.steps = [...this.steps, { id: this.nextRowId++, text: '', timerSeconds: null }];
  }

  removeStep(id: number): void {
    this.steps = this.steps.filter((step) => step.id !== id);
  }

  async save(): Promise<void> {
    const name = this.name.trim();
    if (!this.planId || !name || !this.imageFile || this.saving) {
      if (!this.planId) {
        this.errorMessage = 'Bitte wähle zuerst einen Plan aus.';
      } else if (!name) {
        this.errorMessage = 'Bitte gib einen Namen für das Gericht ein.';
      } else if (!this.imageFile) {
        this.errorMessage = 'Bitte füge ein Foto hinzu.';
      }
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    try {
      const dish = await firstValueFrom(this.mealPlanApi.createDish(this.planId, name, this.imageFile));

      const tags = this.tagsText
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      await firstValueFrom(
        this.dishApi.updateDetails(dish.id, {
          description: this.description.trim() || null,
          prepMinutes: this.prepMinutes,
          servings: this.servings > 0 ? this.servings : 1,
          tags,
        }),
      );

      for (const step of this.steps) {
        const text = step.text.trim();
        if (!text) {
          continue;
        }
        await firstValueFrom(this.dishApi.addStep(dish.id, text, step.timerSeconds));
      }

      for (const ingredient of this.ingredients) {
        const ingredientName = ingredient.name.trim();
        if (!ingredientName || !ingredient.quantity || ingredient.quantity <= 0) {
          continue;
        }
        const ingredientId = await this.resolveIngredientId(ingredientName, ingredient.unit);
        await firstValueFrom(this.dishApi.addIngredient(dish.id, ingredientId, ingredient.quantity));
      }

      if (Object.values(this.nutrition).some((value) => value !== null)) {
        await firstValueFrom(this.dishApi.updateNutrition(dish.id, this.nutrition));
      }

      void this.gamification.record('CREATE_RECIPE', String(dish.id));
      await this.router.navigate(['/dishes', dish.id]);
    } catch (error) {
      console.error('Saving scanned recipe failed', error);
      this.errorMessage = 'Das Gericht konnte nicht vollständig gespeichert werden.';
      this.saving = false;
    }
  }

  private async resolveIngredientId(name: string, unit: string): Promise<number> {
    const existing = this.knownIngredients.find(
      (ingredient) => ingredient.name.localeCompare(name, undefined, { sensitivity: 'base' }) === 0,
    );
    if (existing) {
      return existing.id;
    }
    const created = await firstValueFrom(this.dishApi.createIngredient(name, 0, 0, unit));
    this.knownIngredients = [...this.knownIngredients, created];
    return created.id;
  }

  private releaseImage(): void {
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
      this.imageUrl = '';
    }
  }
}
