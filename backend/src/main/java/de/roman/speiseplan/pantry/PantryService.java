package de.roman.speiseplan.pantry;

import de.roman.speiseplan.dish.Dish;
import de.roman.speiseplan.dish.DishIngredient;
import de.roman.speiseplan.dish.DishIngredientRepository;
import de.roman.speiseplan.dish.DishRepository;
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
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PantryService {
    static final int EXPIRING_SOON_DAYS = 3;
    private static final Comparator<PantryItem> BY_EXPIRY = Comparator.comparing(
            PantryItem::getExpiresOn, Comparator.nullsLast(Comparator.naturalOrder()));

    private final PantryItemRepository pantryItemRepository;
    private final ShoppingListItemRepository shoppingListItemRepository;
    private final DishRepository dishRepository;
    private final DishIngredientRepository dishIngredientRepository;

    public PantryService(
            PantryItemRepository pantryItemRepository,
            ShoppingListItemRepository shoppingListItemRepository,
            DishRepository dishRepository,
            DishIngredientRepository dishIngredientRepository) {
        this.pantryItemRepository = pantryItemRepository;
        this.shoppingListItemRepository = shoppingListItemRepository;
        this.dishRepository = dishRepository;
        this.dishIngredientRepository = dishIngredientRepository;
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
            PantryItem created = new PantryItem(
                item.getIngredientName(), item.getQuantity(), item.getUnit(), purchasedAt);
            created.setExpiresOn(ShelfLife.guess(item.getIngredientName(), today()));
            pantryItems.put(key, created);
            } else {
            existing.setQuantity(existing.getQuantity() + item.getQuantity());
            }
        }
        List<PantryItem> savedItems = pantryItemRepository.saveAll(pantryItems.values());
        shoppingListItemRepository.deleteAll(checkedItems);
        return savedItems.stream().map(PantryItemDto::from).toList();
    }

    @Transactional
    public List<PantryItemDto> addBatch(AddPantryBatchRequest request) {
        Instant purchasedAt = Instant.now();
        Map<String, PantryItem> pantryItems = new LinkedHashMap<>();
        for (AddPantryItemRequest item : request.items()) {
            String ingredientName = item.ingredientName().trim();
            String unit = item.unit().trim();
            String key = ingredientName.toLowerCase(Locale.ROOT) + "|" + unit.toLowerCase(Locale.ROOT);
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
        PantryItem item = pantryItemRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vorrat wurde nicht gefunden."));
        item.setExpiresOn(expiresOn);
        return PantryItemDto.from(item);
    }

    /** Items expiring within {@link #EXPIRING_SOON_DAYS} days (or already expired) plus dishes that use them. */
    @Transactional(readOnly = true)
    public UseSoonDto useSoon() {
        LocalDate limit = today().plusDays(EXPIRING_SOON_DAYS);
        List<PantryItem> expiring = pantryItemRepository.findByExpiresOnLessThanEqualOrderByExpiresOnAsc(limit);
        if (expiring.isEmpty()) {
            return new UseSoonDto(List.of(), List.of());
        }
        Set<String> names = expiring.stream()
                .map(item -> item.getIngredientName().toLowerCase(Locale.ROOT))
                .collect(Collectors.toSet());
        List<Dish> dishes = dishRepository.findAll();
        Map<Long, List<DishIngredient>> ingredientsByDish = dishes.isEmpty()
                ? Map.of()
                : dishIngredientRepository.findByDishIdIn(dishes.stream().map(Dish::getId).toList()).stream()
                        .collect(Collectors.groupingBy(entry -> entry.getDish().getId()));
        List<UseSoonDto.DishSuggestion> suggestions = dishes.stream()
                .map(dish -> new UseSoonDto.DishSuggestion(
                        dish.getId(),
                        dish.getName(),
                        dish.getImageUrl(),
                        ingredientsByDish.getOrDefault(dish.getId(), List.of()).stream()
                                .map(entry -> entry.getIngredient().getName())
                                .filter(name -> names.contains(name.toLowerCase(Locale.ROOT)))
                                .distinct()
                                .toList()))
                .filter(suggestion -> !suggestion.matchedIngredients().isEmpty())
                .sorted(Comparator.comparingInt((UseSoonDto.DishSuggestion s) -> s.matchedIngredients().size())
                        .reversed()
                        .thenComparing(UseSoonDto.DishSuggestion::name, String.CASE_INSENSITIVE_ORDER))
                .limit(6)
                .toList();
        return new UseSoonDto(expiring.stream().map(PantryItemDto::from).toList(), suggestions);
    }

    @Transactional(readOnly = true)
    public long countExpiringSoon() {
        return pantryItemRepository.countByExpiresOnLessThanEqual(today().plusDays(EXPIRING_SOON_DAYS));
    }

    @Transactional
    public void deleteItem(Long itemId) {
        if (!pantryItemRepository.existsById(itemId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Vorrat wurde nicht gefunden.");
        }
        pantryItemRepository.deleteById(itemId);
    }

    @Transactional
    public void consume(List<DishIngredient> ingredients, double factor) {
        for (DishIngredient ingredient : ingredients) {
            double remaining = ingredient.getQuantityGrams() * factor;
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
                if (item.getQuantity() <= 1e-6) {
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

    private static LocalDate earliest(List<LocalDate> dates) {
        return dates.stream().filter(java.util.Objects::nonNull).min(Comparator.naturalOrder()).orElse(null);
    }

    private static LocalDate today() {
        return LocalDate.now(ZoneId.systemDefault());
    }
}
