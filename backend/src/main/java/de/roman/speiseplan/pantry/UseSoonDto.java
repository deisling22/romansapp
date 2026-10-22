package de.roman.speiseplan.pantry;

import java.util.List;

public record UseSoonDto(List<PantryItemDto> items, List<DishSuggestion> dishes) {
    public record DishSuggestion(Long id, String name, String imageUrl, List<String> matchedIngredients) {
    }
}
