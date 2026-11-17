package de.roman.speiseplan.pantry;

import de.roman.speiseplan.dish.DishIngredient;
import de.roman.speiseplan.ingredient.IngredientMatcher;
import de.roman.speiseplan.shopping.ShoppingListItem;
import de.roman.speiseplan.shopping.ShoppingListItemRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
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
    public static final int EXPIRING_SOON_DAYS = 3;
    private static final Comparator<PantryItem> BY_EXPIRY = Comparator.comparing(
            PantryItem::getExpiresOn, Comparator.nullsLast(Comparator.naturalOrder()));

    private final PantryItemRepository pantryItemRepository;
    private final PantryRemovalRepository pantryRemovalRepository;
    private final ShoppingListItemRepository shoppingListItemRepository;

    public PantryService(
            PantryItemRepository pantryItemRepository,
            PantryRemovalRepository pantryRemovalRepository,
            ShoppingListItemRepository shoppingListItemRepository) {
        this.pantryItemRepository = pantryItemRepository;
        this.pantryRemovalRepository = pantryRemovalRepository;
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
            target.setExpiresOn(earliest(matches.stream().map(PantryItem::getExpiresOn).toList()));
            pantryItemRepository.deleteAll(matches.subList(1, matches.size()));
        }
        return grouped.values().stream()
                .map(matches -> matches.getFirst())
                .sorted(BY_EXPIRY)
                .map(PantryItemDto::from)
                .toList();
    }

    /**
     * Books a purchase into the pantry in one transaction: the given shopping list items (or, without
     * ids, all checked ones) leave the list. Packaged goods arrive as whole packs.
     */
    @Transactional
    public List<PantryItemDto> checkout(List<Long> itemIds) {
        List<ShoppingListItem> purchased = itemIds == null
                ? shoppingListItemRepository.findByCheckedTrue()
                : shoppingListItemRepository.findAllById(itemIds);
        Instant purchasedAt = Instant.now();
        Map<String, PantryItem> pantryItems = new LinkedHashMap<>();
        for (ShoppingListItem item : purchased) {
            double quantity =
                    IngredientMatcher.purchaseQuantity(item.getIngredientName(), item.getUnit(), item.getQuantity());
            PantryItem existing = pantryItems.get(exactKey(item.getIngredientName(), item.getUnit()));
            if (existing == null) {
                PantryItem created = new PantryItem(item.getIngredientName(), quantity, item.getUnit(), purchasedAt);
                created.setExpiresOn(ShelfLife.guess(item.getIngredientName(), today()));
                pantryItems.put(exactKey(item.getIngredientName(), item.getUnit()), created);
            } else {
                existing.setQuantity(existing.getQuantity() + quantity);
            }
        }
        List<PantryItem> savedItems = pantryItemRepository.saveAll(pantryItems.values());
        shoppingListItemRepository.deleteAll(purchased);
        return savedItems.stream().map(PantryItemDto::from).toList();
    }

    @Transactional
    public List<PantryItemDto> addBatch(AddPantryBatchRequest request) {
        Instant purchasedAt = Instant.now();
        Map<String, PantryItem> pantryItems = new LinkedHashMap<>();
        for (AddPantryItemRequest item : request.items()) {
            String ingredientName = item.ingredientName().trim();
            String unit = item.unit().trim();
            String key = exactKey(ingredientName, unit);
            PantryItem existing = pantryItems.get(key);
            LocalDate expiresOn = item.expiresOn() != null
                    ? item.expiresOn()
                    : ShelfLife.guess(ingredientName, today());
            if (existing == null) {
                PantryItem created = new PantryItem(ingredientName, item.quantity(), unit, purchasedAt);
                created.setExpiresOn(expiresOn);
                pantryItems.put(key, created);
            } else {
                existing.setQuantity(existing.getQuantity() + item.quantity());
                existing.setExpiresOn(earliest(java.util.Arrays.asList(existing.getExpiresOn(), expiresOn)));
            }
        }
        return pantryItemRepository.saveAll(pantryItems.values()).stream()
                .map(PantryItemDto::from)
                .toList();
    }

    @Transactional
    public PantryItemDto updateExpiry(Long itemId, LocalDate expiresOn) {
        PantryItem item = requireItem(itemId);
        item.setExpiresOn(expiresOn);
        return PantryItemDto.from(item);
    }

    @Transactional
    public PantryItemDto updateQuantity(Long itemId, double quantity) {
        PantryItem item = requireItem(itemId);
        item.setQuantity(quantity);
        return PantryItemDto.from(item);
    }

    @Transactional(readOnly = true)
    public long countWastedThisMonth() {
        Instant startOfMonth = today().withDayOfMonth(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
        return pantryRemovalRepository.countByReasonAndRemovedAtGreaterThanEqual(
                PantryRemoval.Reason.WASTED, startOfMonth);
    }

    @Transactional
    public void deleteItem(Long itemId, PantryRemoval.Reason reason) {
        PantryItem item = requireItem(itemId);
        if (reason != null) {
            pantryRemovalRepository.save(new PantryRemoval(item, reason, Instant.now()));
        }
        pantryItemRepository.delete(item);
    }

    /** Takes the recipe quantities from matching stock, whatever its unit, soonest-expiring first. */
    @Transactional
    public void consume(List<DishIngredient> ingredients, double factor) {
        List<PantryItem> stock = new ArrayList<>(pantryItemRepository.findAll());
        stock.sort(BY_EXPIRY.thenComparing(PantryItem::getPurchasedAt));
        List<PantryItem> depleted = new ArrayList<>();
        for (DishIngredient ingredient : ingredients) {
            IngredientMatcher.Amount need = IngredientMatcher.normalize(
                    ingredient.getIngredient().getName(),
                    ingredient.getIngredient().getUnit(),
                    ingredient.getQuantityGrams() * factor);
            double remaining = need.quantity();
            for (PantryItem item : stock) {
                if (remaining <= 1e-6) {
                    break;
                }
                if (item.getQuantity() <= 1e-6
                        || !IngredientMatcher.key(item.getIngredientName(), item.getUnit()).equals(need.key())) {
                    continue;
                }
                double toBase = IngredientMatcher.baseFactor(item.getIngredientName(), item.getUnit());
                double consumed = Math.min(item.getQuantity() * toBase, remaining);
                item.setQuantity(item.getQuantity() - consumed / toBase);
                remaining -= consumed;
                if (item.getQuantity() <= 1e-6) {
                    depleted.add(item);
                }
            }
        }
        pantryItemRepository.deleteAll(depleted);
    }

    private PantryItem requireItem(Long itemId) {
        return pantryItemRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vorrat wurde nicht gefunden."));
    }

    private String batchKey(PantryItem item) {
        return exactKey(item.getIngredientName(), item.getUnit()) + "|" + item.getPurchasedAt();
    }

    private static String exactKey(String ingredientName, String unit) {
        return ingredientName.toLowerCase(Locale.ROOT) + "|" + unit.toLowerCase(Locale.ROOT);
    }

    private static LocalDate earliest(List<LocalDate> dates) {
        return dates.stream().filter(java.util.Objects::nonNull).min(Comparator.naturalOrder()).orElse(null);
    }

    static LocalDate today() {
        return LocalDate.now(ZoneId.systemDefault());
    }
}
