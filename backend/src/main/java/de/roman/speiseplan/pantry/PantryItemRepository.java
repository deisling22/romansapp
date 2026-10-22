package de.roman.speiseplan.pantry;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PantryItemRepository extends JpaRepository<PantryItem, Long> {
    List<PantryItem> findAllByOrderByPurchasedAtDescIngredientNameAsc();

    List<PantryItem> findByIngredientNameIgnoreCaseAndUnitIgnoreCaseOrderByPurchasedAtAsc(
            String ingredientName, String unit);

    List<PantryItem> findByExpiresOnLessThanEqualOrderByExpiresOnAsc(LocalDate limit);

    long countByExpiresOnLessThanEqual(LocalDate limit);
}
