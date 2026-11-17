package de.roman.speiseplan.plan;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CookLogRepository extends JpaRepository<CookLog, Long> {
    List<CookLog> findByCookedAtGreaterThanEqualAndCookedAtLessThanOrderByCookedAtAsc(Instant start, Instant end);

    Optional<CookLog> findTopByPlanIdAndMealSlotOrderByCookedAtDesc(Long planId, MealSlot mealSlot);

    /** Rows of (planId, mealSlot, latest cookedAt) for the given plans, in one query. */
    @Query("select c.planId, c.mealSlot, max(c.cookedAt) from CookLog c "
            + "where c.planId in :planIds group by c.planId, c.mealSlot")
    List<Object[]> findLastCookedByPlanAndSlot(@Param("planIds") List<Long> planIds);
}
