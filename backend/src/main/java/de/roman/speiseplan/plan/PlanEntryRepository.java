package de.roman.speiseplan.plan;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlanEntryRepository extends JpaRepository<PlanEntry, Long> {
    long countByPlanId(Long planId);

    List<PlanEntry> findByPlanIdOrderBySortOrderAsc(Long planId);

    Optional<PlanEntry> findTopByPlanIdOrderBySortOrderDesc(Long planId);
}