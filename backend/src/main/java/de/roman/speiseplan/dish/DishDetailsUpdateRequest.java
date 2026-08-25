package de.roman.speiseplan.dish;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.util.List;

public record DishDetailsUpdateRequest(
        @Size(max = 2000) String description,
        @Positive Integer prepMinutes,
        @Min(1) int servings,
        List<String> tags) {
}
