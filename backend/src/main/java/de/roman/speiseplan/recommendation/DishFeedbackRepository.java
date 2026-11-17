package de.roman.speiseplan.recommendation;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DishFeedbackRepository extends JpaRepository<DishFeedback, Long> {
    boolean existsByDishId(Long dishId);
}
