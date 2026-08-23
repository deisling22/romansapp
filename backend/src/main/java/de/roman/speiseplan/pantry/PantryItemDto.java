package de.roman.speiseplan.pantry;

import java.time.Instant;

public record PantryItemDto(Long id, String ingredientName, double quantity, String unit, Instant purchasedAt) {
    public static PantryItemDto from(PantryItem item) {
        return new PantryItemDto(
                item.getId(), item.getIngredientName(), item.getQuantity(), item.getUnit(), item.getPurchasedAt());
    }
}
