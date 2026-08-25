package de.roman.speiseplan.dish;

import java.util.List;

public record DishDetailsDto(
        String description,
        Integer prepMinutes,
        int servings,
        List<String> tags) {
}
