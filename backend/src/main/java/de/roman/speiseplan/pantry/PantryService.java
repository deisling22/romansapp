package de.roman.speiseplan.pantry;

import de.roman.speiseplan.dish.DishIngredient;
import de.roman.speiseplan.shopping.ShoppingListItem;
import de.roman.speiseplan.shopping.ShoppingListItemRepository;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
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

    @Transactional
    public List<PantryItemDto> getItems() {
        List<PantryItem> items = pantryItemRepository.findAllByOrderByPurchasedAtDescIngredientNameAsc();
        Map<String, List<PantryItem>> grouped = items.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        this::batchKey,
                        LinkedHashMap::new,
                        java.util.stream.Collectors.toList()));
        for (List<PantryItem> matches : grouped.values()) {
            if (matches.size() < 2) {
                continue;
            }
            PantryItem target = matches.getFirst();
            target.setQuantity(matches.stream().mapToDouble(item -> item.getQuantity()).sum());
            pantryItemRepository.deleteAll(matches.subList(1, matches.size()));
        }
        return grouped.values().stream()
                .map(matches -> matches.getFirst())
                .map(PantryItemDto::from)
                .toList();
    }

    @Transactional
    public List<PantryItemDto> checkoutCheckedItems() {
        List<ShoppingListItem> checkedItems = shoppingListItemRepository.findByCheckedTrue();
        Instant purchasedAt = Instant.now();
        Map<String, PantryItem> pantryItems = new LinkedHashMap<>();
        for (ShoppingListItem item : checkedItems) {
            String key = item.getIngredientName().toLowerCase(Locale.ROOT)
                + "|" + item.getUnit().toLowerCase(Locale.ROOT);
            PantryItem existing = pantryItems.get(key);
            if (existing == null) {
            pantryItems.put(key, new PantryItem(
                item.getIngredientName(), item.getQuantity(), item.getUnit(), purchasedAt));
            } else {
            existing.setQuantity(existing.getQuantity() + item.getQuantity());
            }
        }
        List<PantryItem> savedItems = pantryItemRepository.saveAll(pantryItems.values());
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

    private String batchKey(PantryItem item) {
        return item.getIngredientName().toLowerCase(Locale.ROOT)
                + "|" + item.getUnit().toLowerCase(Locale.ROOT)
                + "|" + item.getPurchasedAt();
    }
}
