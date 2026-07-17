package de.roman.speiseplan.dish;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record AddDishIngredientRequest(@NotNull Long ingredientId, @Positive double quantityGrams) {
}
