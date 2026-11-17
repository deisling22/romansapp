package de.roman.speiseplan.schedule;

import de.roman.speiseplan.plan.MealSlot;
import jakarta.validation.constraints.Positive;
import java.util.List;

public final class DishActionDtos {
    private DishActionDtos() {
    }

    /** Quantities are in the recipe's unit and scaled to {@code servings}. */
    public record IngredientAvailabilityDto(
            String ingredientName, String unit, double required, double missing, double uncovered) {
    }

    public record DishAvailabilityDto(double servings, List<IngredientAvailabilityDto> ingredients) {
    }

    public record CookDishRequest(@Positive Double servings, MealSlot mealSlot) {
    }

    /** {@code planEntryId} is set when the dish was due in a plan and that entry was ticked off. */
    public record CookedDto(Long dishId, Long planEntryId) {
    }
}
