package de.roman.speiseplan.plan;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CookLogRepository extends JpaRepository<CookLog, Long> {
    List<CookLog> findByCookedAtGreaterThanEqualAndCookedAtLessThanOrderByCookedAtAsc(Instant start, Instant end);

    Optional<CookLog> findTopByPlanIdAndMealSlotOrderByCookedAtDesc(Long planId, MealSlot mealSlot);
}
