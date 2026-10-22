package de.roman.speiseplan.schedule;

import de.roman.speiseplan.plan.MealSlot;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public final class ScheduleDtos {
    private ScheduleDtos() {
    }

    public record ScheduleDto(List<ScheduleDayDto> days, int shoppingWindowDays) {
    }

    public record ScheduleDayDto(int dayOffset, LocalDate date, List<ScheduledMealDto> meals) {
    }

    public record ScheduledMealDto(
            int dayOffset,
            String mealSlot,
            String status,
            Long planEntryId,
            Long planId,
            String planName,
            Long dishId,
            String dishName,
            String imageUrl,
            Integer prepMinutes,
            String advancePrepNote,
            double portions,
            boolean cooksLeftovers,
            String ingredientStatus,
            List<MissingIngredientDto> missingIngredients) {
    }

    public record MissingIngredientDto(String ingredientName, String unit, double missingQuantity, double uncoveredQuantity) {
    }

    public record ReplacementSuggestionDto(
            Long dishId,
            String name,
            String imageUrl,
            Integer prepMinutes,
            int ingredientCount,
            int missingCount,
            int coveragePercent) {
    }

    public record SwapEntryRequest(@NotNull Long otherEntryId) {
    }

    public record ReplaceDishRequest(@NotNull Long dishId) {
    }

    public record MealSlotRequest(@NotNull MealSlot mealSlot) {
    }
}
