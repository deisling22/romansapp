package de.roman.speiseplan.dashboard;

public record NextDishDto(
        Long planEntryId,
        Long planId,
        Long dishId,
        String name,
        String imageUrl,
        Double averageRating,
        int ratingCount) {
}
