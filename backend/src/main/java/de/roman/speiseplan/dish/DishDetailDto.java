package de.roman.speiseplan.dish;

import java.util.List;

public record DishDetailDto(
        Long id,
        String name,
        String imageUrl,
        String description,
        Integer prepMinutes,
        int servings,
        List<String> tags,
        double caloriesPerServing,
        double proteinPerServing,
        Double carbsGrams,
        Double fatGrams,
        Double vitaminAMcg,
        Double vitaminCMg,
        Double vitaminDMcg,
        Double vitaminKMcg,
        Double vitaminB12Mcg,
        Double folateMcg,
        List<String> galleryImageUrls,
        List<PrepStepDto> steps,
        List<DishIngredientDto> ingredients,
        Double averageRating,
        int ratingCount,
        Integer myRating,
        boolean favorite) {
}
