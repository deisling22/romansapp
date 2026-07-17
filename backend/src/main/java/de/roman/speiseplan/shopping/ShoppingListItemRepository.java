package de.roman.speiseplan.shopping;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShoppingListItemRepository extends JpaRepository<ShoppingListItem, Long> {
    List<ShoppingListItem> findByPlanIdOrderByIngredientNameAsc(Long planId);

    void deleteByPlanId(Long planId);
}
