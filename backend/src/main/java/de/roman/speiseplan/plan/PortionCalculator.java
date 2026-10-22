package de.roman.speiseplan.plan;

import de.roman.speiseplan.dish.Dish;
import de.roman.speiseplan.profile.ProfileDto;

public final class PortionCalculator {
    private PortionCalculator() {
    }

    public static boolean cooksLeftovers(MealPlan plan, MealSlot slot) {
        return slot == MealSlot.DINNER && plan.isLeftoversForLunch();
    }

    public static double mealPortions(ProfileDto profile, MealPlan plan, MealSlot slot) {
        double portions = Math.max(1, profile.householdSize()) * profile.defaultPortionSize();
        return cooksLeftovers(plan, slot) ? portions * 2 : portions;
    }

    /** Recipe quantities refer to {@code dish.servings}; scale them to the portions actually cooked. */
    public static double ingredientFactor(Dish dish, double portions) {
        return portions / Math.max(1, dish.getServings());
    }
}
