import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfileApiService } from '../../core/profile-api.service';
import { OnboardingService } from '../../core/onboarding.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SettingsComponent implements OnInit {
  readonly form = this.formBuilder.nonNullable.group({
    defaultPortionSize: [1, [Validators.required, Validators.min(1)]],
    bodyWeightKg: this.formBuilder.control<number | null>(null),
    bodyHeightCm: this.formBuilder.control<number | null>(null),
    nutritionTrackingEnabled: [false],
    calorieGoal: this.formBuilder.control<number | null>(null, [Validators.min(0)]),
    age: this.formBuilder.control<number | null>(null, [Validators.min(0)]),
    sex: this.formBuilder.control<'MALE' | 'FEMALE' | null>(null),
    activityLevel: this.formBuilder.control<number | null>(null),
  });

  loading = true;
  saving = false;
  errorMessage = '';
  savedMessage = '';
  calculationError = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly profileApi: ProfileApiService,
    private readonly onboarding: OnboardingService,
  ) {}

  ngOnInit(): void {
    this.profileApi.getProfile().subscribe({
      next: (profile) => {
        this.form.setValue({
          defaultPortionSize: profile.defaultPortionSize,
          bodyWeightKg: profile.bodyWeightKg,
          bodyHeightCm: profile.bodyHeightCm,
          nutritionTrackingEnabled: profile.nutritionTrackingEnabled,
          calorieGoal: profile.calorieGoal,
          age: profile.age,
          sex: profile.sex,
          activityLevel: profile.activityLevel,
        });
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Das Profil konnte nicht geladen werden.';
        this.loading = false;
      },
    });
  }

  // Mifflin-St Jeor: BMR = 10*kg + 6.25*cm - 5*Alter + (Mann: +5 / Frau: -161), TDEE = BMR * Aktivitätsfaktor.
  calculateCalorieGoal(): void {
    this.calculationError = '';
    const { bodyWeightKg, bodyHeightCm, age, sex, activityLevel } = this.form.getRawValue();
    if (!bodyWeightKg || !bodyHeightCm || !age || !sex || !activityLevel) {
      this.calculationError =
        'Für die Berechnung werden Gewicht, Größe, Alter, Geschlecht und Aktivitätslevel benötigt.';
      return;
    }
    const bmr = 10 * bodyWeightKg + 6.25 * bodyHeightCm - 5 * age + (sex === 'MALE' ? 5 : -161);
    const tdee = bmr * activityLevel;
    this.form.controls.calorieGoal.setValue(Math.round(tdee));
  }

  submit(): void {
    if (this.form.invalid || this.saving) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.savedMessage = '';
    this.profileApi.updateProfile(this.form.getRawValue()).subscribe({
      next: () => {
        this.saving = false;
        this.savedMessage = 'Profil gespeichert.';
      },
      error: () => {
        this.errorMessage = 'Das Profil konnte nicht gespeichert werden.';
        this.saving = false;
      },
    });
  }

  showOnboarding(): void {
    this.onboarding.restart();
  }
}
