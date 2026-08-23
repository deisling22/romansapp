package de.roman.speiseplan.creator;

import java.util.List;

public record CreatorDetailDto(
        Long id,
        String name,
        String handle,
        String bio,
        String avatarUrl,
        List<CreatorPlanDto> plans) {
}