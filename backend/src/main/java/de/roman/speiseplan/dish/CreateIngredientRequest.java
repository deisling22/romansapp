package de.roman.speiseplan.dish;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record CreateIngredientRequest(
        @NotBlank String name,
        @PositiveOrZero double kcalPer100,
        @PositiveOrZero double proteinPer100,
        @NotBlank String unit) {
}
