package de.roman.speiseplan.cost;

import de.roman.speiseplan.plan.MealPlan;
import de.roman.speiseplan.plan.MealPlanRepository;
import de.roman.speiseplan.plan.PlanEntryRepository;
import de.roman.speiseplan.profile.ProfileDto;
import java.time.LocalDate;
import java.time.ZoneId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CostSummaryService {
    private final ReceiptService receiptService;
    private final MealPlanRepository mealPlanRepository;
    private final PlanEntryRepository planEntryRepository;

    public CostSummaryService(
            ReceiptService receiptService,
            MealPlanRepository mealPlanRepository,
            PlanEntryRepository planEntryRepository) {
        this.receiptService = receiptService;
        this.mealPlanRepository = mealPlanRepository;
        this.planEntryRepository = planEntryRepository;
    }

    @Transactional(readOnly = true)
    public CostSummaryDto summarize(ProfileDto profile) {
        LocalDate today = LocalDate.now(ZoneId.systemDefault());
        LocalDate weekStart = ReceiptService.startOfWeek(today);
        double spentThisWeek = round(receiptService.sum(weekStart, weekStart.plusDays(6)));
        double spentThisMonth = round(receiptService.sum(today.withDayOfMonth(1), today.withDayOfMonth(today.lengthOfMonth())));

        Double plannedCost = null;
        for (MealPlan plan : mealPlanRepository.findAllByCreatorIsNullOrderByCreatedAtAsc()) {
            if (!plan.isActive()) {
                continue;
            }
            Double planCost = plan.getCostEur() != null ? plan.getCostEur() : sumDishCosts(plan.getId());
            if (planCost != null) {
                plannedCost = (plannedCost == null ? 0 : plannedCost) + planCost;
            }
        }

        Double budget = profile.weeklyBudgetEur();
        Integer budgetPercent = budget == null || budget <= 0 ? null : (int) Math.round(spentThisWeek / budget * 100);
        return new CostSummaryDto(
                spentThisWeek,
                spentThisMonth,
                plannedCost == null ? null : round(plannedCost),
                budget,
                budgetPercent);
    }

    private Double sumDishCosts(Long planId) {
        Double total = null;
        for (var entry : planEntryRepository.findByPlanIdOrderBySortOrderAsc(planId)) {
            Double cost = entry.getDish().getCostEur();
            if (cost != null) {
                total = (total == null ? 0 : total) + cost;
            }
        }
        return total;
    }

    private static double round(double value) {
        return Math.round(value * 100) / 100.0;
    }

    public record CostSummaryDto(
            double spentThisWeek,
            double spentThisMonth,
            Double plannedCost,
            Double weeklyBudget,
            Integer budgetPercent) {
    }
}
