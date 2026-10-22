package de.roman.speiseplan.plan;

public record PlanSummaryDto(Long id, String name, long dishCount, boolean active, boolean leftoversForLunch) {
    public static PlanSummaryDto from(MealPlan plan, long dishCount) {
        return new PlanSummaryDto(plan.getId(), plan.getName(), dishCount, plan.isActive(), plan.isLeftoversForLunch());
    }
}