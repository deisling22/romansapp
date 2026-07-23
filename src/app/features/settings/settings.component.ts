import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfileApiService } from '../../core/profile-api.service';

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
  });

  loading = true;
  saving = false;
  errorMessage = '';
  savedMessage = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly profileApi: ProfileApiService,
  ) {}

  ngOnInit(): void {
    this.profileApi.getProfile().subscribe({
      next: (profile) => {
        this.form.setValue({
          defaultPortionSize: profile.defaultPortionSize,
          bodyWeightKg: profile.bodyWeightKg,
          bodyHeightCm: profile.bodyHeightCm,
        });
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Das Profil konnte nicht geladen werden.';
        this.loading = false;
      },
    });
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
}
