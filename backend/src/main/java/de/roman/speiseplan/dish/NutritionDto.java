package de.roman.speiseplan.dish;

public record NutritionDto(
        Double carbsGrams,
        Double fatGrams,
        Double vitaminAMcg,
        Double vitaminCMg,
        Double vitaminDMcg,
        Double vitaminKMcg,
        Double vitaminB12Mcg,
        Double folateMcg) {
}
