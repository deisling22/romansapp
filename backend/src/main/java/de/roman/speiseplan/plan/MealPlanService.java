package de.roman.speiseplan.plan;

import de.roman.speiseplan.dish.Dish;
import de.roman.speiseplan.dish.DishDto;
import de.roman.speiseplan.dish.DishRepository;
import de.roman.speiseplan.storage.LocalImageStorage;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class MealPlanService {
    private final MealPlanRepository mealPlanRepository;
    private final PlanEntryRepository planEntryRepository;
    private final DishRepository dishRepository;
    private final LocalImageStorage imageStorage;

    public MealPlanService(
            MealPlanRepository mealPlanRepository,
            PlanEntryRepository planEntryRepository,
            DishRepository dishRepository,
            LocalImageStorage imageStorage) {
        this.mealPlanRepository = mealPlanRepository;
        this.planEntryRepository = planEntryRepository;
        this.dishRepository = dishRepository;
        this.imageStorage = imageStorage;
    }

    @Transactional(readOnly = true)
    public List<PlanSummaryDto> getPlans() {
        return mealPlanRepository.findAllByCreatorIsNullOrderByCreatedAtAsc().stream()
                .map(plan -> PlanSummaryDto.from(plan, planEntryRepository.countByPlanId(plan.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DishDto> getDishes(Long planId) {
        requirePlan(planId);
        return planEntryRepository.findByPlanIdOrderBySortOrderAsc(planId).stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public PlanSummaryDto createPlan(String name) {
        MealPlan plan = mealPlanRepository.save(new MealPlan(name.trim()));
        return PlanSummaryDto.from(plan, 0);
    }

    @Transactional
    public PlanSummaryDto updateSettings(Long planId, PlanSettingsRequest request) {
        MealPlan plan = requireOwnPlan(planId);
        if (request.active() != null) {
            plan.setActive(request.active());
        }
        if (request.leftoversForLunch() != null) {
            plan.setLeftoversForLunch(request.leftoversForLunch());
        }
        return PlanSummaryDto.from(plan, planEntryRepository.countByPlanId(planId));
    }

    @Transactional
    public void deletePlan(Long planId) {
        MealPlan plan = requirePlan(planId);
        mealPlanRepository.delete(plan);
    }

    @Transactional
    public PlanSummaryDto copyPlan(Long planId) {
        MealPlan source = requirePlan(planId);
        MealPlan copy = mealPlanRepository.save(new MealPlan(source.getName() + " (Kopie)"));
        copy.setLeftoversForLunch(source.isLeftoversForLunch());
        List<PlanEntry> entries = planEntryRepository.findByPlanIdOrderBySortOrderAsc(planId);
        for (PlanEntry entry : entries) {
            PlanEntry copiedEntry = new PlanEntry(copy, entry.getDish(), entry.getSortOrder());
            copiedEntry.setMealSlot(entry.getMealSlot());
            planEntryRepository.save(copiedEntry);
        }
        return PlanSummaryDto.from(copy, entries.size());
    }

    @Transactional
    public DishDto addDish(Long planId, String name, MultipartFile image) {
        MealPlan plan = requirePlan(planId);
        String imageUrl = imageStorage.store(image);
        Dish dish = dishRepository.save(new Dish(name.trim(), imageUrl));
        int nextSortOrder = planEntryRepository.findTopByPlanIdOrderBySortOrderDesc(planId)
                .map(entry -> entry.getSortOrder() + 1)
                .orElse(0);
        PlanEntry entry = planEntryRepository.save(new PlanEntry(plan, dish, nextSortOrder));
        return toDto(entry);
    }

    private MealPlan requirePlan(Long planId) {
        return mealPlanRepository.findById(planId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan wurde nicht gefunden."));
    }

    private MealPlan requireOwnPlan(Long planId) {
        MealPlan plan = requirePlan(planId);
        if (plan.getCreator() != null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan wurde nicht gefunden.");
        }
        return plan;
    }

    private DishDto toDto(PlanEntry entry) {
        Dish dish = entry.getDish();
        return new DishDto(
                dish.getId(), dish.getName(), dish.getImageUrl(), entry.getSortOrder(), entry.getId(), entry.isCooked(),
                entry.getMealSlot().name());
    }
}