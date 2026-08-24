package de.roman.speiseplan.recommendation;

import de.roman.speiseplan.creator.CreatorSummaryDto;
import de.roman.speiseplan.dish.DishCatalogEntryDto;
import java.util.List;

public record RecommendationsDto(
        List<DishCatalogEntryDto> dishes,
        List<CreatorSummaryDto> creators,
        List<PlanRecommendationDto> plans) {
}
