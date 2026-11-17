package de.roman.speiseplan.shopping;

import de.roman.speiseplan.ingredient.IngredientMatcher;

/**
 * {@code category} is the supermarket aisle; {@code purchaseQuantity} is what a completed purchase books
 * into the pantry (whole packs for packaged goods), {@code packSize} the assumed pack in the item's unit.
 */
public record ShoppingListItemDto(
        Long id,
        String ingredientName,
        double quantity,
        String unit,
        boolean checked,
        String category,
        double purchaseQuantity,
        double packSize) {
    public static ShoppingListItemDto from(ShoppingListItem item) {
        return new ShoppingListItemDto(
                item.getId(),
                item.getIngredientName(),
                item.getQuantity(),
                item.getUnit(),
                item.isChecked(),
                IngredientMatcher.category(item.getIngredientName()),
                IngredientMatcher.purchaseQuantity(item.getIngredientName(), item.getUnit(), item.getQuantity()),
                IngredientMatcher.packSize(item.getIngredientName(), item.getUnit()));
    }
}
