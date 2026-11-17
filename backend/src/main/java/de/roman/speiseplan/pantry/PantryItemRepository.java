package de.roman.speiseplan.pantry;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PantryItemRepository extends JpaRepository<PantryItem, Long> {
    List<PantryItem> findAllByOrderByPurchasedAtDescIngredientNameAsc();

    List<PantryItem> findByExpiresOnLessThanEqualOrderByExpiresOnAsc(LocalDate limit);
}
