package de.roman.speiseplan.dish;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DishRatingRepository extends JpaRepository<DishRating, Long> {
    Optional<DishRating> findByDishIdAndUserEmail(Long dishId, String userEmail);

    List<DishRating> findByUserEmail(String userEmail);

    @Query("select r.dish.id as dishId, avg(r.stars) as averageRating, count(r) as ratingCount "
            + "from DishRating r where r.dish.id in :dishIds group by r.dish.id")
    List<DishRatingSummaryProjection> summarizeByDishIds(@Param("dishIds") List<Long> dishIds);

    interface DishRatingSummaryProjection {
        Long getDishId();

        Double getAverageRating();

        Long getRatingCount();
    }
}
