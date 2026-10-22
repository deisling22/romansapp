package de.roman.speiseplan.recipeimport;

import java.util.List;

public record RecipeImportDto(
        String name,
        String description,
        String imageUrl,
        Integer servings,
        Integer prepMinutes,
        List<String> ingredients,
        List<String> steps,
        List<String> tags,
        String sourceUrl) {
}
