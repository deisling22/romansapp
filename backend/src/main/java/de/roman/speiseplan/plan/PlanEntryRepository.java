package de.roman.speiseplan.plan;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlanEntryRepository extends JpaRepository<PlanEntry, Long> {
    long countByPlanId(Long planId);

    List<PlanEntry> findByPlanIdOrderBySortOrderAsc(Long planId);

    Optional<PlanEntry> findTopByPlanIdOrderBySortOrderDesc(Long planId);

    boolean existsByPlanIdAndDishId(Long planId, Long dishId);

    Optional<PlanEntry> findFirstByPlanCreatorIsNullAndCookedFalseOrderByPlanIdAscSortOrderAsc();

    List<PlanEntry> findByPlanCreatorIsNullAndCookedTrueAndCookedAtBetween(Instant start, Instant end);

    long countByPlanCreatorIdAndCreatedAtAfter(Long creatorId, Instant createdAt);
}