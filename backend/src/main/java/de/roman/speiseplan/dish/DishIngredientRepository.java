package de.roman.speiseplan.dish;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DishIngredientRepository extends JpaRepository<DishIngredient, Long> {
    List<DishIngredient> findByDishId(Long dishId);

    List<DishIngredient> findByDishIdIn(List<Long> dishIds);
}
