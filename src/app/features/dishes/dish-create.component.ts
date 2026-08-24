import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MealPlanApiService } from '../../core/meal-plan-api.service';
import { RecipeSyncService } from '../../core/recipe-sync.service';

@Component({
    selector: 'app-dish-create',
    templateUrl: './dish-create.component.html',
    styleUrls: ['./dish-create.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DishCreateComponent implements OnInit, OnDestroy {
  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
  });

  planId = 0;
  localClientId = '';
  image: File | null = null;
  previewUrl: string | null = null;
  submitting = false;
  errorMessage = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly mealPlanApi: MealPlanApiService,
    private readonly recipeSync: RecipeSyncService,
  ) {}

  ngOnInit(): void {
    this.localClientId = this.route.snapshot.paramMap.get('clientId') ?? '';
    this.planId = Number(this.route.snapshot.paramMap.get('planId'));
  }

  get backLink(): unknown[] {
    return this.localClientId ? ['/local-plans', this.localClientId] : ['/plans', this.planId];
  }

  ngOnDestroy(): void {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const image = input.files?.item(0) ?? null;
    if (!image) {
      return;
    }

    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
    this.image = image;
    this.previewUrl = URL.createObjectURL(image);
    this.errorMessage = '';
  }

  submit(): void {
    if (this.form.invalid || !this.image || this.submitting) {
      this.form.markAllAsTouched();
      if (!this.image) {
        this.errorMessage = 'Bitte füge ein Foto hinzu.';
      }
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    if (this.localClientId) {
      void this.saveLocally();
      return;
    }
    this.mealPlanApi.createDish(this.planId, this.form.controls.name.value.trim(), this.image).subscribe({
      next: () => this.router.navigate(['/plans', this.planId]),
      error: () => {
        this.errorMessage = 'Das Gericht konnte nicht gespeichert werden. Bitte versuche es erneut.';
        this.submitting = false;
      },
    });
  }

  private async saveLocally(): Promise<void> {
    try {
      await this.recipeSync.addDish(
        this.localClientId,
        this.form.controls.name.value.trim(),
        this.image!,
      );
      await this.router.navigate(['/local-plans', this.localClientId]);
    } catch {
      this.errorMessage = 'Das Gericht konnte nicht lokal gespeichert werden.';
      this.submitting = false;
    }
  }
}