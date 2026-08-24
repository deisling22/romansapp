package de.roman.speiseplan.dish;

import jakarta.validation.constraints.DecimalMin;

public record NutritionUpdateRequest(
        @DecimalMin(value = "0") Double carbsGrams,
        @DecimalMin(value = "0") Double fatGrams,
        @DecimalMin(value = "0") Double vitaminAMcg,
        @DecimalMin(value = "0") Double vitaminCMg,
        @DecimalMin(value = "0") Double vitaminDMcg,
        @DecimalMin(value = "0") Double vitaminKMcg,
        @DecimalMin(value = "0") Double vitaminB12Mcg,
        @DecimalMin(value = "0") Double folateMcg) {
}
