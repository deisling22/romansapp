package de.roman.speiseplan.dashboard;

import java.time.LocalDate;
import java.util.List;

/** Averages only count days with at least one cooked meal, so untracked days don't drag them down. */
public record WeekNutritionDto(
        List<Day> days,
        int trackedDays,
        double averageCalories,
        double averageProtein,
        double averageCarbs,
        double averageFat,
        Double calorieGoal,
        Double proteinGoal) {
    public record Day(LocalDate date, int meals, double calories, double protein, double carbs, double fat) {
    }
}
