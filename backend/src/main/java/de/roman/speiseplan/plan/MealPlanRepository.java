package de.roman.speiseplan.plan;

import java.util.List;
import java.util.Optional;
import java.time.Instant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MealPlanRepository extends JpaRepository<MealPlan, Long> {
    List<MealPlan> findAllByOrderByCreatedAtAsc();

    List<MealPlan> findAllByCreatorIsNullOrderByCreatedAtAsc();

    List<MealPlan> findByCreatorIdOrderByCreatedAtAsc(Long creatorId);

    List<MealPlan> findAllByCreatorIsNotNullOrderByCreatedAtAsc();

    List<MealPlan> findByOwnerEmailOrderByUpdatedAtAsc(String ownerEmail);

    Optional<MealPlan> findByOwnerEmailAndClientId(String ownerEmail, String clientId);

    long countByCreatorIdAndCreatedAtAfter(Long creatorId, Instant createdAt);
}