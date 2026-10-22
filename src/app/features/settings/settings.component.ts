import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfileApiService } from '../../core/profile-api.service';
import { OnboardingService } from '../../core/onboarding.service';
import { ScheduleApiService } from '../../core/schedule-api.service';
import { StapleItem } from '../../core/models';

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
    householdSize: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
    shoppingTripsPerWeek: [2, [Validators.required, Validators.min(1), Validators.max(7)]],
  });

  staples: StapleItem[] = [];
  newStapleName = '';
  newStapleQuantity = 1;
  newStapleUnit = 'Stk.';
  stapleError = '';

  loading = true;
  saving = false;
  errorMessage = '';
  savedMessage = '';
  calculationError = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly profileApi: ProfileApiService,
    private readonly onboarding: OnboardingService,
    private readonly scheduleApi: ScheduleApiService,
  ) {}

  ngOnInit(): void {
    this.scheduleApi.getStaples().subscribe({
      next: (staples) => (this.staples = staples),
    });
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
          householdSize: profile.householdSize,
          shoppingTripsPerWeek: profile.shoppingTripsPerWeek,
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

  addStaple(): void {
    const name = this.newStapleName.trim();
    const unit = this.newStapleUnit.trim();
    if (!name || !unit || this.newStapleQuantity <= 0) {
      return;
    }
    this.stapleError = '';
    this.scheduleApi.addStaple(name, this.newStapleQuantity, unit).subscribe({
      next: (staple) => {
        this.staples = [...this.staples, staple];
        this.newStapleName = '';
        this.newStapleQuantity = 1;
      },
      error: () => (this.stapleError = 'Der Grundbedarf konnte nicht gespeichert werden.'),
    });
  }

  removeStaple(staple: StapleItem): void {
    this.scheduleApi.deleteStaple(staple.id).subscribe({
      next: () => (this.staples = this.staples.filter((entry) => entry.id !== staple.id)),
      error: () => (this.stapleError = 'Der Grundbedarf konnte nicht entfernt werden.'),
    });
  }

  showOnboarding(): void {
    this.onboarding.restart();
  }
}
