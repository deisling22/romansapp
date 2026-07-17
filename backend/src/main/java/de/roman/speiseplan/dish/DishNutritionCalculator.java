package de.roman.speiseplan.dish;

import java.util.List;

public final class DishNutritionCalculator {
    private DishNutritionCalculator() {
    }

    public static double caloriesPerServing(List<DishIngredient> ingredients, int servings) {
        return totalFor(ingredients, DishIngredient::getQuantityGrams, i -> i.getIngredient().getKcalPer100())
                / Math.max(servings, 1);
    }

    public static double proteinPerServing(List<DishIngredient> ingredients, int servings) {
        return totalFor(ingredients, DishIngredient::getQuantityGrams, i -> i.getIngredient().getProteinPer100())
                / Math.max(servings, 1);
    }

    private static double totalFor(
            List<DishIngredient> ingredients,
            java.util.function.ToDoubleFunction<DishIngredient> quantity,
            java.util.function.ToDoubleFunction<DishIngredient> per100) {
        return ingredients.stream()
                .mapToDouble(entry -> per100.applyAsDouble(entry) * quantity.applyAsDouble(entry) / 100.0)
                .sum();
    }
}
