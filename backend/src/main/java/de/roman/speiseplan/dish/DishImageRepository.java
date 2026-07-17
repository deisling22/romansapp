package de.roman.speiseplan.dish;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DishImageRepository extends JpaRepository<DishImage, Long> {
    List<DishImage> findByDishIdOrderBySortOrderAsc(Long dishId);

    long countByDishId(Long dishId);
}
