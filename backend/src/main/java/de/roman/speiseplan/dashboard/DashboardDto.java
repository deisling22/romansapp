package de.roman.speiseplan.dashboard;

public record DashboardDto(
        double caloriesToday,
        double proteinToday,
        Double proteinGoal,
        Integer proteinPercent,
        boolean nutritionTrackingEnabled,
        double carbsToday,
        double fatToday,
        double vitaminAToday,
        double vitaminCToday,
        double vitaminDToday,
        NextDishDto nextDish,
        long cartItemCount,
        long pantryItemCount) {
}
