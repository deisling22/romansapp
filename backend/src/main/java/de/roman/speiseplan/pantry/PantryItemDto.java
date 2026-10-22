package de.roman.speiseplan.pantry;

import java.time.Instant;
import java.time.LocalDate;

public record PantryItemDto(
        Long id, String ingredientName, double quantity, String unit, Instant purchasedAt, LocalDate expiresOn) {
    public static PantryItemDto from(PantryItem item) {
        return new PantryItemDto(
                item.getId(), item.getIngredientName(), item.getQuantity(), item.getUnit(), item.getPurchasedAt(),
                item.getExpiresOn());
    }
}
