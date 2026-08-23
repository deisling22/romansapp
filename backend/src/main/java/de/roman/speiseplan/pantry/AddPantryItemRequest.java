package de.roman.speiseplan.pantry;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record AddPantryItemRequest(
        @NotBlank @Size(max = 120) String ingredientName,
        @Positive double quantity,
        @NotBlank @Size(max = 20) String unit) {
}