package de.roman.speiseplan.plan;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MealPlanRepository extends JpaRepository<MealPlan, Long> {
    List<MealPlan> findAllByOrderByCreatedAtAsc();

    List<MealPlan> findAllByCreatorIsNullOrderByCreatedAtAsc();

    List<MealPlan> findByCreatorIdOrderByCreatedAtAsc(Long creatorId);
}