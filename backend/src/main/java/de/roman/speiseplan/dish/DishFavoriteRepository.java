package de.roman.speiseplan.dish;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DishFavoriteRepository extends JpaRepository<DishFavorite, Long> {
    boolean existsByDishIdAndUserEmail(Long dishId, String userEmail);

    List<DishFavorite> findByUserEmail(String userEmail);

    void deleteByDishIdAndUserEmail(Long dishId, String userEmail);
}