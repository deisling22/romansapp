package de.roman.speiseplan.dish;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DishIngredientRepository extends JpaRepository<DishIngredient, Long> {
    List<DishIngredient> findByDishId(Long dishId);

    List<DishIngredient> findByDishIdIn(List<Long> dishIds);

    @Query("select distinct di.dish.id from DishIngredient di where di.ingredient.id in :ingredientIds")
    List<Long> findDishIdsByIngredientIdIn(@Param("ingredientIds") List<Long> ingredientIds);
}
