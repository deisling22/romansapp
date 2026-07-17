package de.roman.speiseplan.dish;

import java.util.List;

public record DishCatalogEntryDto(
        Long id,
        String name,
        String imageUrl,
        String description,
        Integer prepMinutes,
        List<String> tags) {
}
