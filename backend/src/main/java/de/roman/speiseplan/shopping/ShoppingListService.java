package de.roman.speiseplan.shopping;

import de.roman.speiseplan.dish.DishIngredient;
import de.roman.speiseplan.dish.DishIngredientRepository;
import de.roman.speiseplan.plan.MealPlan;
import de.roman.speiseplan.plan.MealPlanRepository;
import de.roman.speiseplan.plan.PlanEntry;
import de.roman.speiseplan.plan.PlanEntryRepository;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
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

    public ShoppingListService(
            ShoppingListItemRepository shoppingListItemRepository,
            MealPlanRepository mealPlanRepository,
            PlanEntryRepository planEntryRepository,
            DishIngredientRepository dishIngredientRepository) {
        this.shoppingListItemRepository = shoppingListItemRepository;
        this.mealPlanRepository = mealPlanRepository;
        this.planEntryRepository = planEntryRepository;
        this.dishIngredientRepository = dishIngredientRepository;
    }

    @Transactional(readOnly = true)
    public List<ShoppingListItemDto> getItems(Long planId) {
        requirePlan(planId);
        return shoppingListItemRepository.findByPlanIdOrderByIngredientNameAsc(planId).stream()
                .map(ShoppingListItemDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ShoppingListItemDto> getAllItems() {
        return shoppingListItemRepository.findAllByOrderByCheckedAscIngredientNameAsc().stream()
                .map(ShoppingListItemDto::from)
                .toList();
    }

    @Transactional
    public ShoppingListItemDto addItem(CreateShoppingListItemRequest request) {
        ShoppingListItem item = new ShoppingListItem(
                request.ingredientName().trim(), request.quantity(), request.unit().trim());
        return ShoppingListItemDto.from(shoppingListItemRepository.save(item));
    }

    @Transactional
    public List<ShoppingListItemDto> generate(Long planId) {
        MealPlan plan = requirePlan(planId);
        List<PlanEntry> entries = planEntryRepository.findByPlanIdOrderBySortOrderAsc(planId);
        List<Long> dishIds = entries.stream().map(entry -> entry.getDish().getId()).distinct().toList();
        List<DishIngredient> dishIngredients = dishIngredientRepository.findByDishIdIn(dishIds);

        Map<String, ShoppingListItem> aggregated = new LinkedHashMap<>();
        for (DishIngredient dishIngredient : dishIngredients) {
            String name = dishIngredient.getIngredient().getName();
            String unit = dishIngredient.getIngredient().getUnit();
            String key = name.toLowerCase() + "|" + unit.toLowerCase();
            aggregated.merge(
                    key,
                    new ShoppingListItem(plan, name, dishIngredient.getQuantityGrams(), unit),
                    (existing, addition) -> new ShoppingListItem(
                            plan, existing.getIngredientName(), existing.getQuantity() + addition.getQuantity(), unit));
        }

        shoppingListItemRepository.deleteByPlanId(planId);
        List<ShoppingListItem> saved = shoppingListItemRepository.saveAll(aggregated.values());
        return saved.stream().map(ShoppingListItemDto::from).toList();
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

    private MealPlan requirePlan(Long planId) {
        return mealPlanRepository.findById(planId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan wurde nicht gefunden."));
    }
}
