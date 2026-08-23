package de.roman.speiseplan.pantry;

import de.roman.speiseplan.dish.DishIngredient;
import de.roman.speiseplan.shopping.ShoppingListItem;
import de.roman.speiseplan.shopping.ShoppingListItemRepository;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PantryService {
    private final PantryItemRepository pantryItemRepository;
    private final ShoppingListItemRepository shoppingListItemRepository;

    public PantryService(
            PantryItemRepository pantryItemRepository,
            ShoppingListItemRepository shoppingListItemRepository) {
        this.pantryItemRepository = pantryItemRepository;
        this.shoppingListItemRepository = shoppingListItemRepository;
    }

    @Transactional(readOnly = true)
    public List<PantryItemDto> getItems() {
        return pantryItemRepository.findAllByOrderByPurchasedAtDescIngredientNameAsc().stream()
                .map(PantryItemDto::from)
                .toList();
    }

    @Transactional
    public List<PantryItemDto> checkoutCheckedItems() {
        List<ShoppingListItem> checkedItems = shoppingListItemRepository.findByCheckedTrue();
        Instant purchasedAt = Instant.now();
        List<PantryItem> pantryItems = checkedItems.stream()
                .map(item -> new PantryItem(
                        item.getIngredientName(), item.getQuantity(), item.getUnit(), purchasedAt))
                .toList();
        List<PantryItem> savedItems = pantryItemRepository.saveAll(pantryItems);
        shoppingListItemRepository.deleteAll(checkedItems);
        return savedItems.stream().map(PantryItemDto::from).toList();
    }

    @Transactional
    public void deleteItem(Long itemId) {
        if (!pantryItemRepository.existsById(itemId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Vorrat wurde nicht gefunden.");
        }
        pantryItemRepository.deleteById(itemId);
    }

    @Transactional
    public void consume(List<DishIngredient> ingredients) {
        for (DishIngredient ingredient : ingredients) {
            double remaining = ingredient.getQuantityGrams();
            List<PantryItem> stock = pantryItemRepository
                    .findByIngredientNameIgnoreCaseAndUnitIgnoreCaseOrderByPurchasedAtAsc(
                            ingredient.getIngredient().getName(), ingredient.getIngredient().getUnit());
            List<PantryItem> depleted = new ArrayList<>();
            for (PantryItem item : stock) {
                if (remaining <= 0) {
                    break;
                }
                double consumed = Math.min(item.getQuantity(), remaining);
                item.setQuantity(item.getQuantity() - consumed);
                remaining -= consumed;
                if (item.getQuantity() == 0) {
                    depleted.add(item);
                }
            }
            pantryItemRepository.deleteAll(depleted);
        }
    }

    @Transactional(readOnly = true)
    public long countItems() {
        return pantryItemRepository.count();
    }
}
