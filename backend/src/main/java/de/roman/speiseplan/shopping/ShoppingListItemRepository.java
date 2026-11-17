package de.roman.speiseplan.shopping;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShoppingListItemRepository extends JpaRepository<ShoppingListItem, Long> {
    List<ShoppingListItem> findByPlanIdOrderByIngredientNameAsc(Long planId);

    List<ShoppingListItem> findAllByOrderByCheckedAscIngredientNameAsc();

    List<ShoppingListItem> findByCheckedTrue();

    void deleteByPlanId(Long planId);
}
