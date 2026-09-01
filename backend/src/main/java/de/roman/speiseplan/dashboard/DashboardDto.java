package de.roman.speiseplan.dashboard;

public record DashboardDto(
        double caloriesToday,
        Double calorieGoal,
        Integer caloriePercent,
        double proteinToday,
        Double proteinGoal,
        Integer proteinPercent,
        boolean nutritionTrackingEnabled,
        double carbsToday,
        double fatToday,
        double vitaminAToday,
        double vitaminCToday,
        double vitaminDToday,
        double vitaminKToday,
        double vitaminB12Today,
        double folateToday,
        NextDishDto nextDish,
        long cartItemCount,
        long pantryItemCount) {
}
