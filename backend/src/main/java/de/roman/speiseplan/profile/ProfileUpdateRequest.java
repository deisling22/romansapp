package de.roman.speiseplan.profile;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record ProfileUpdateRequest(
        @NotNull @DecimalMin(value = "0.1") Double defaultPortionSize,
        @DecimalMin(value = "1") Double bodyWeightKg,
        @DecimalMin(value = "1") Double bodyHeightCm) {
}
