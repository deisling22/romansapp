package de.roman.speiseplan.dashboard;

public record DashboardDto(
        double caloriesToday,
        double proteinToday,
        Double proteinGoal,
        Integer proteinPercent,
        NextDishDto nextDish,
        long cartItemCount,
        long pantryItemCount) {
}
