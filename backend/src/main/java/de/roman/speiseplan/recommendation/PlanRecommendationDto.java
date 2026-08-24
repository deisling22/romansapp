package de.roman.speiseplan.recommendation;

public record PlanRecommendationDto(
        Long id,
        String name,
        Long creatorId,
        String creatorName,
        String creatorHandle,
        int dishCount,
        String coverImageUrl) {
}
