package de.roman.speiseplan.shopping;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record CreateShoppingListItemRequest(
        @NotBlank String ingredientName,
        @Positive double quantity,
        @NotBlank String unit) {
}
