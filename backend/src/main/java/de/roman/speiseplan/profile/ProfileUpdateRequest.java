package de.roman.speiseplan.profile;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ProfileUpdateRequest(
        @NotNull @DecimalMin(value = "0.1") Double defaultPortionSize,
        @DecimalMin(value = "1") Double bodyWeightKg,
        @DecimalMin(value = "1") Double bodyHeightCm,
        @NotNull Boolean nutritionTrackingEnabled,
        @DecimalMin(value = "0") Double calorieGoal,
        @Min(0) Integer age,
        String sex,
        @DecimalMin(value = "1") Double activityLevel) {
}
