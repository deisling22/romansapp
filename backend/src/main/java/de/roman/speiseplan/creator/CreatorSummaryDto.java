package de.roman.speiseplan.creator;

public record CreatorSummaryDto(
        Long id,
        String name,
        String handle,
        String bio,
        String avatarUrl,
        String reelImageUrl,
        long planCount) {
}