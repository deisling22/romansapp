package de.roman.speiseplan.shopping;

import de.roman.speiseplan.dish.DishIngredient;
import de.roman.speiseplan.dish.DishIngredientRepository;
import de.roman.speiseplan.ingredient.IngredientMatcher;
import de.roman.speiseplan.pantry.PantryItemRepository;
import de.roman.speiseplan.plan.MealPlan;
import de.roman.speiseplan.plan.MealPlanRepository;
import de.roman.speiseplan.plan.PlanEntry;
import de.roman.speiseplan.plan.PlanEntryRepository;
import de.roman.speiseplan.plan.PortionCalculator;
import de.roman.speiseplan.profile.ProfileDto;
import de.roman.speiseplan.profile.ProfileService;
import de.roman.speiseplan.schedule.ScheduleService;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ShoppingListService {
    private final ShoppingListItemRepository shoppingListItemRepository;
    private final MealPlanRepository mealPlanRepository;
    private final PlanEntryRepository planEntryRepository;
    private final DishIngredientRepository dishIngredientRepository;
    private final PantryItemRepository pantryItemRepository;
    private final ProfileService profileService;

    public ShoppingListService(
            ShoppingListItemRepository shoppingListItemRepository,
            MealPlanRepository mealPlanRepository,
            PlanEntryRepository planEntryRepository,
            DishIngredientRepository dishIngredientRepository,
            PantryItemRepository pantryItemRepository,
            ProfileService profileService) {
        this.shoppingListItemRepository = shoppingListItemRepository;
        this.mealPlanRepository = mealPlanRepository;
        this.planEntryRepository = planEntryRepository;
        this.dishIngredientRepository = dishIngredientRepository;
        this.pantryItemRepository = pantryItemRepository;
        this.profileService = profileService;
    }

    @Transactional(readOnly = true)
    public List<ShoppingListItemDto> getItems(Long planId) {
        requirePlan(planId);
        return shoppingListItemRepository.findByPlanIdOrderByIngredientNameAsc(planId).stream()
                .map(ShoppingListItemDto::from)
                .toList();
    }

    @Transactional
    public List<ShoppingListItemDto> getAllItems() {
        List<ShoppingListItem> items = shoppingListItemRepository.findAllByOrderByCheckedAscIngredientNameAsc();
        Map<String, List<ShoppingListItem>> grouped = items.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        item -> IngredientMatcher.key(item.getIngredientName(), item.getUnit()),
                        LinkedHashMap::new,
                        java.util.stream.Collectors.toList()));
        for (List<ShoppingListItem> matches : grouped.values()) {
            if (matches.size() < 2) {
                continue;
            }
            ShoppingListItem target = matches.getFirst();
            target.setQuantity(quantityIn(target, matches));
            target.setChecked(matches.stream().allMatch(item -> item.isChecked()));
            shoppingListItemRepository.deleteAll(matches.subList(1, matches.size()));
        }
        return grouped.values().stream()
                .map(matches -> matches.getFirst())
                .map(ShoppingListItemDto::from)
                .toList();
    }

    @Transactional
    public ShoppingListItemDto addItem(CreateShoppingListItemRequest request) {
        return ShoppingListItemDto.from(mergeItem(
            null, request.ingredientName().trim(), request.quantity(), request.unit().trim()));
    }

    @Transactional
    public List<ShoppingListItemDto> generate(Long planId) {
        MealPlan plan = requirePlan(planId);
        List<PlanEntry> allEntries = planEntryRepository.findByPlanIdOrderBySortOrderAsc(planId);
        List<PlanEntry> openEntries = allEntries.stream().filter(entry -> !entry.isCooked()).toList();
        // A finished round means the next round is what needs to be bought.
        List<PlanEntry> entries = openEntries.isEmpty() ? allEntries : openEntries;
        List<Long> dishIds = entries.stream().map(entry -> entry.getDish().getId()).distinct().toList();
        Map<Long, List<DishIngredient>> ingredientsByDish = dishIds.isEmpty()
                ? Map.of()
                : dishIngredientRepository.findByDishIdIn(dishIds).stream()
                        .collect(Collectors.groupingBy(ingredient -> ingredient.getDish().getId()));
        ProfileDto profile = profileService.getProfile();

        Map<String, ShoppingListItem> aggregated = new LinkedHashMap<>();
        for (PlanEntry entry : entries) {
            double factor = PortionCalculator.ingredientFactor(
                    entry.getDish(), PortionCalculator.mealPortions(profile, plan, entry.getMealSlot()));
            for (DishIngredient dishIngredient : ingredientsByDish.getOrDefault(entry.getDish().getId(), List.of())) {
                String name = dishIngredient.getIngredient().getName();
                String unit = dishIngredient.getIngredient().getUnit();
                double quantity = dishIngredient.getQuantityGrams() * factor;
                aggregated.merge(
                        IngredientMatcher.key(name, unit) + "|" + unit,
                        new ShoppingListItem(plan, name, quantity, unit),
                        (existing, addition) -> new ShoppingListItem(
                                plan, existing.getIngredientName(), existing.getQuantity() + addition.getQuantity(), unit));
            }
        }

        // Only top up items still missing after pantry stock is subtracted, so re-running generate() is idempotent.
        Map<String, Double> pantryStock = ScheduleService.pantryStock(pantryItemRepository.findAll());
        List<ShoppingListItemDto> updated = new ArrayList<>();
        for (ShoppingListItem need : aggregated.values()) {
            String key = IngredientMatcher.key(need.getIngredientName(), need.getUnit());
            double toBase = IngredientMatcher.baseFactor(need.getIngredientName(), need.getUnit());
            double fromPantry = Math.min(need.getQuantity(), Math.max(0, pantryStock.getOrDefault(key, 0.0)) / toBase);
            pantryStock.merge(key, -fromPantry * toBase, Double::sum);
            double stillNeeded = need.getQuantity() - fromPantry;
            if (stillNeeded <= 1e-6) {
                continue;
            }
            updated.add(ShoppingListItemDto.from(
                    ensureQuantity(plan, need.getIngredientName(), need.getUnit(), stillNeeded)));
        }
        return updated;
    }

    @Transactional
    public ShoppingListItemDto updateItem(Long itemId, boolean checked) {
        ShoppingListItem item = shoppingListItemRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Eintrag wurde nicht gefunden."));
        item.setChecked(checked);
        return ShoppingListItemDto.from(item);
    }

    @Transactional
    public void deleteItem(Long itemId) {
        if (!shoppingListItemRepository.existsById(itemId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Eintrag wurde nicht gefunden.");
        }
        shoppingListItemRepository.deleteById(itemId);
    }

    @Transactional(readOnly = true)
    public long countItems() {
        return shoppingListItemRepository.count();
    }

    @Transactional
    public void clear() {
        shoppingListItemRepository.deleteAll(shoppingListItemRepository.findAll());
    }

    private ShoppingListItem mergeItem(
            MealPlan plan, String ingredientName, double quantity, String unit) {
        List<ShoppingListItem> matches = matches(ingredientName, unit);
        if (matches.isEmpty()) {
            return shoppingListItemRepository.save(new ShoppingListItem(plan, ingredientName, quantity, unit));
        }

        ShoppingListItem target = matches.getFirst();
        double combinedQuantity = convert(ingredientName, unit, quantity, target) + quantityIn(target, matches);
        target.addQuantity(combinedQuantity - target.getQuantity());
        if (matches.size() > 1) {
            shoppingListItemRepository.deleteAll(matches.subList(1, matches.size()));
        }
        return target;
    }

    private ShoppingListItem ensureQuantity(MealPlan plan, String ingredientName, String unit, double desiredQuantity) {
        List<ShoppingListItem> matches = matches(ingredientName, unit);
        if (matches.isEmpty()) {
            return shoppingListItemRepository.save(new ShoppingListItem(plan, ingredientName, desiredQuantity, unit));
        }
        ShoppingListItem target = matches.getFirst();
        double existing = quantityIn(target, matches);
        if (matches.size() > 1) {
            target.setQuantity(existing);
            shoppingListItemRepository.deleteAll(matches.subList(1, matches.size()));
        }
        double desired = convert(ingredientName, unit, desiredQuantity, target);
        if (existing < desired) {
            target.addQuantity(desired - target.getQuantity());
        }
        return target;
    }

    /** Same ingredient regardless of spelling, plural or unit ("Tomate 3 Stk." matches "Tomaten 300 g"). */
    private List<ShoppingListItem> matches(String ingredientName, String unit) {
        String key = IngredientMatcher.key(ingredientName, unit);
        return shoppingListItemRepository.findAll().stream()
                .filter(item -> IngredientMatcher.key(item.getIngredientName(), item.getUnit()).equals(key))
                .sorted(java.util.Comparator.comparing(ShoppingListItem::getId))
                .toList();
    }

    private static double quantityIn(ShoppingListItem target, List<ShoppingListItem> items) {
        return items.stream()
                .mapToDouble(item -> convert(item.getIngredientName(), item.getUnit(), item.getQuantity(), target))
                .sum();
    }

    private static double convert(String ingredientName, String unit, double quantity, ShoppingListItem target) {
        return quantity * IngredientMatcher.baseFactor(ingredientName, unit)
                / IngredientMatcher.baseFactor(target.getIngredientName(), target.getUnit());
    }

    private MealPlan requirePlan(Long planId) {
        return mealPlanRepository.findById(planId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan wurde nicht gefunden."));
    }
}
