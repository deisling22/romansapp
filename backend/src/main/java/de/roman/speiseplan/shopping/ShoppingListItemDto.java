package de.roman.speiseplan.shopping;

public record ShoppingListItemDto(Long id, String ingredientName, double quantity, String unit, boolean checked) {
    public static ShoppingListItemDto from(ShoppingListItem item) {
        return new ShoppingListItemDto(
                item.getId(), item.getIngredientName(), item.getQuantity(), item.getUnit(), item.isChecked());
    }
}
