package de.roman.speiseplan.profile;

public record ProfileDto(
        double defaultPortionSize,
        Double bodyWeightKg,
        Double bodyHeightCm,
        boolean nutritionTrackingEnabled,
        Double calorieGoal,
        Integer age,
        String sex,
        Double activityLevel) {
}
