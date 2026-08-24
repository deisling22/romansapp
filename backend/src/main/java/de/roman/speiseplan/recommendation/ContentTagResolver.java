package de.roman.speiseplan.recommendation;

import de.roman.speiseplan.plan.MealPlan;
import de.roman.speiseplan.plan.MealPlanRepository;
import de.roman.speiseplan.plan.PlanEntry;
import de.roman.speiseplan.plan.PlanEntryRepository;
import java.util.Arrays;
import java.util.List;
import org.springframework.stereotype.Component;

/** Derives a tag "fingerprint" for plans and creators from the dishes they contain. */
@Component
public class ContentTagResolver {
    private final MealPlanRepository mealPlanRepository;
    private final PlanEntryRepository planEntryRepository;

    public ContentTagResolver(MealPlanRepository mealPlanRepository, PlanEntryRepository planEntryRepository) {
        this.mealPlanRepository = mealPlanRepository;
        this.planEntryRepository = planEntryRepository;
    }

    public List<String> planTags(Long planId) {
        return planEntryRepository.findByPlanIdOrderBySortOrderAsc(planId).stream()
                .map(PlanEntry::getDish)
                .flatMap(dish -> splitTags(dish.getTags()).stream())
                .distinct()
                .toList();
    }

    public List<String> creatorTags(Long creatorId) {
        return mealPlanRepository.findByCreatorIdOrderByCreatedAtAsc(creatorId).stream()
                .map(MealPlan::getId)
                .flatMap(planId -> planTags(planId).stream())
                .distinct()
                .toList();
    }

    public static List<String> splitTags(String tags) {
        if (tags == null || tags.isBlank()) {
            return List.of();
        }
        return Arrays.stream(tags.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(tag -> !tag.isEmpty())
                .toList();
    }
}
