package de.roman.speiseplan.plan;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlanEntryRepository extends JpaRepository<PlanEntry, Long> {
    long countByPlanId(Long planId);

    List<PlanEntry> findByPlanIdOrderBySortOrderAsc(Long planId);

    List<PlanEntry> findByPlanIdInOrderBySortOrderAsc(List<Long> planIds);

    List<PlanEntry> findByPlanIdAndMealSlot(Long planId, MealSlot mealSlot);

    Optional<PlanEntry> findTopByPlanIdOrderBySortOrderDesc(Long planId);

    boolean existsByPlanIdAndDishId(Long planId, Long dishId);

    boolean existsByDishIdAndPlanCreatorIsNotNull(Long dishId);

    long countByPlanCreatorIdAndCreatedAtAfter(Long creatorId, Instant createdAt);
}