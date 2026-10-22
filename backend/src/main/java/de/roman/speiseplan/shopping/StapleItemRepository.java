package de.roman.speiseplan.shopping;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StapleItemRepository extends JpaRepository<StapleItem, Long> {
    List<StapleItem> findAllByOrderByIngredientNameAsc();
}
