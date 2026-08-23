import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PantryApiService } from '../../core/pantry-api.service';
import {
  IngredientRecognitionService,
  RecognizedIngredient,
} from './ingredient-recognition.service';

@Component({
  selector: 'app-ingredient-scan',
  templateUrl: './ingredient-scan.component.html',
  styleUrls: ['./ingredient-scan.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class IngredientScanComponent implements OnDestroy {
  readonly units = ['Stk.', 'g', 'kg', 'ml', 'l', 'Packung'];
  imageUrl = '';
  ingredients: RecognizedIngredient[] = [];
  analyzing = false;
  saving = false;
  analyzed = false;
  errorMessage = '';

  constructor(
    private readonly recognition: IngredientRecognitionService,
    private readonly pantryApi: PantryApiService,
    private readonly router: Router,
  ) {}

  ngOnDestroy(): void {
    this.releaseImage();
  }

  selectImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
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
    this.imageUrl = URL.createObjectURL(file);
    this.ingredients = [];
    this.analyzed = false;
    this.errorMessage = '';
  }

  async analyze(image: HTMLImageElement): Promise<void> {
    if (!this.imageUrl || this.analyzing) {
      return;
    }
    this.analyzing = true;
    this.errorMessage = '';
    try {
      this.ingredients = await this.recognition.recognize(image);
      this.analyzed = true;
      if (this.ingredients.length === 0) {
        this.errorMessage = 'Keine unterstützte Zutat sicher erkannt. Ergänze sie unten manuell.';
      }
    } catch {
      this.errorMessage = 'Das lokale KI-Modell konnte nicht geladen werden. Prüfe beim ersten Scan die Internetverbindung.';
    } finally {
      this.analyzing = false;
    }
  }

  addIngredient(): void {
    this.ingredients = [...this.ingredients, this.recognition.createEmpty()];
  }

  removeIngredient(id: number): void {
    this.ingredients = this.ingredients.filter((ingredient) => ingredient.id !== id);
  }

  save(): void {
    const items = this.ingredients
      .map((ingredient) => ({
        ingredientName: ingredient.name.trim(),
        quantity: Number(ingredient.quantity),
        unit: ingredient.unit,
      }))
      .filter((ingredient) => ingredient.ingredientName && ingredient.quantity > 0);
    if (items.length === 0 || this.saving) {
      this.errorMessage = 'Ergänze mindestens eine Zutat mit gültiger Menge.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.pantryApi.addBatch(items).subscribe({
      next: () => void this.router.navigate(['/pantry']),
      error: () => {
        this.errorMessage = 'Die Zutaten konnten nicht in den Vorrat übernommen werden.';
        this.saving = false;
      },
    });
  }

  confidenceLabel(confidence: number): string {
    return `${Math.round(confidence * 100)} % sicher`;
  }

  private releaseImage(): void {
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
      this.imageUrl = '';
    }
  }
}