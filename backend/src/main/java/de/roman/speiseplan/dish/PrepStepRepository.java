package de.roman.speiseplan.dish;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrepStepRepository extends JpaRepository<PrepStep, Long> {
    List<PrepStep> findByDishIdOrderByStepOrderAsc(Long dishId);

    long countByDishId(Long dishId);
}
