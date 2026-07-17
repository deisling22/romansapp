package de.roman.speiseplan.dish;

public record IngredientDto(Long id, String name, double kcalPer100, double proteinPer100, String unit) {
    public static IngredientDto from(Ingredient ingredient) {
        return new IngredientDto(
                ingredient.getId(),
                ingredient.getName(),
                ingredient.getKcalPer100(),
                ingredient.getProteinPer100(),
                ingredient.getUnit());
    }
}
