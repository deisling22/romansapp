package de.roman.speiseplan.creator;

import de.roman.speiseplan.dish.Dish;
import de.roman.speiseplan.dish.DishDto;
import de.roman.speiseplan.plan.MealPlan;
import de.roman.speiseplan.plan.MealPlanRepository;
import de.roman.speiseplan.plan.MealPlanService;
import de.roman.speiseplan.plan.PlanEntry;
import de.roman.speiseplan.plan.PlanEntryRepository;
import de.roman.speiseplan.plan.PlanSummaryDto;
import de.roman.speiseplan.recommendation.ContentType;
import de.roman.speiseplan.recommendation.TrendScoringService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CreatorService {
    private final CreatorRepository creatorRepository;
    private final MealPlanRepository mealPlanRepository;
    private final PlanEntryRepository planEntryRepository;
    private final MealPlanService mealPlanService;
    private final TrendScoringService trendScoringService;

    public CreatorService(
            CreatorRepository creatorRepository,
            MealPlanRepository mealPlanRepository,
            PlanEntryRepository planEntryRepository,
            MealPlanService mealPlanService,
            TrendScoringService trendScoringService) {
        this.creatorRepository = creatorRepository;
        this.mealPlanRepository = mealPlanRepository;
        this.planEntryRepository = planEntryRepository;
        this.mealPlanService = mealPlanService;
        this.trendScoringService = trendScoringService;
    }

    @Transactional(readOnly = true)
    public List<CreatorSummaryDto> getCreators() {
        return creatorRepository.findAll().stream()
                .map(creator -> new CreatorSummaryDto(
                        creator.getId(), creator.getName(), creator.getHandle(), creator.getBio(),
                        creator.getAvatarUrl(), creator.getReelImageUrl(), creator.getReelVideoUrl(),
                        mealPlanRepository.findByCreatorIdOrderByCreatedAtAsc(creator.getId()).size()))
                .toList();
    }

    @Transactional(readOnly = true)
    public CreatorDetailDto getCreator(Long creatorId) {
        Creator creator = requireCreator(creatorId);
        trendScoringService.bump(ContentType.CREATOR, creatorId, 1);
        List<CreatorPlanDto> plans = mealPlanRepository.findByCreatorIdOrderByCreatedAtAsc(creatorId).stream()
                .map(this::toPlanDto)
                .toList();
        return new CreatorDetailDto(
                creator.getId(), creator.getName(), creator.getHandle(), creator.getBio(),
                creator.getAvatarUrl(), plans);
    }

    @Transactional(readOnly = true)
    public List<DishDto> getPlanDishes(Long creatorId, Long planId) {
        requireCreatorPlan(creatorId, planId);
        trendScoringService.bump(ContentType.PLAN, planId, 1);
        return planEntryRepository.findByPlanIdOrderBySortOrderAsc(planId).stream()
                .map(this::toDishDto)
                .toList();
    }

    @Transactional
    public PlanSummaryDto copyPlan(Long creatorId, Long planId) {
        requireCreatorPlan(creatorId, planId);
        trendScoringService.bump(ContentType.PLAN, planId, 6);
        trendScoringService.bump(ContentType.CREATOR, creatorId, 3);
        return mealPlanService.copyPlan(planId);
    }

    private Creator requireCreator(Long creatorId) {
        return creatorRepository.findById(creatorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Creator wurde nicht gefunden."));
    }

    private MealPlan requireCreatorPlan(Long creatorId, Long planId) {
        MealPlan plan = mealPlanRepository.findById(planId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan wurde nicht gefunden."));
        if (plan.getCreator() == null || !plan.getCreator().getId().equals(creatorId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan wurde nicht gefunden.");
        }
        return plan;
    }

    private CreatorPlanDto toPlanDto(MealPlan plan) {
        List<PlanEntry> entries = planEntryRepository.findByPlanIdOrderBySortOrderAsc(plan.getId());
        String coverImageUrl = entries.isEmpty() ? "" : entries.getFirst().getDish().getImageUrl();
        return new CreatorPlanDto(plan.getId(), plan.getName(), entries.size(), coverImageUrl);
    }

    private DishDto toDishDto(PlanEntry entry) {
        Dish dish = entry.getDish();
        return new DishDto(
                dish.getId(), dish.getName(), dish.getImageUrl(), entry.getSortOrder(),
                entry.getId(), entry.isCooked());
    }
}