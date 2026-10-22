package de.roman.speiseplan.schedule;

import de.roman.speiseplan.dish.Dish;
import de.roman.speiseplan.dish.DishIngredient;
import de.roman.speiseplan.dish.DishIngredientRepository;
import de.roman.speiseplan.dish.DishRepository;
import de.roman.speiseplan.pantry.PantryItem;
import de.roman.speiseplan.pantry.PantryItemRepository;
import de.roman.speiseplan.plan.MealPlan;
import de.roman.speiseplan.plan.MealSlot;
import de.roman.speiseplan.plan.PlanEntry;
import de.roman.speiseplan.plan.PlanEntryRepository;
import de.roman.speiseplan.plan.PortionCalculator;
import de.roman.speiseplan.profile.ProfileService;
import de.roman.speiseplan.schedule.ScheduleDtos.ReplacementSuggestionDto;
import de.roman.speiseplan.schedule.ScheduleService.IngredientNeed;
import de.roman.speiseplan.schedule.ScheduleService.MealStatus;
import de.roman.speiseplan.schedule.ScheduleService.Schedule;
import de.roman.speiseplan.schedule.ScheduleService.ScheduledMeal;
import de.roman.speiseplan.shopping.CreateShoppingListItemRequest;
import de.roman.speiseplan.shopping.ShoppingListItemDto;
import de.roman.speiseplan.shopping.ShoppingListService;
import de.roman.speiseplan.shopping.StapleItem;
import de.roman.speiseplan.shopping.StapleItemRepository;
import java.util.Comparator;
import java.util.HashMap;
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
public class PlanEntryActionService {
    private static final int MAX_SUGGESTIONS = 12;
    private static final Set<String> COUNT_UNITS = Set.of("stk.", "stk", "stück", "packung", "bund", "dose", "glas");

    private final PlanEntryRepository planEntryRepository;
    private final DishRepository dishRepository;
    private final DishIngredientRepository dishIngredientRepository;
    private final PantryItemRepository pantryItemRepository;
    private final StapleItemRepository stapleItemRepository;
    private final ShoppingListService shoppingListService;
    private final ScheduleService scheduleService;
    private final ProfileService profileService;

    public PlanEntryActionService(
            PlanEntryRepository planEntryRepository,
            DishRepository dishRepository,
            DishIngredientRepository dishIngredientRepository,
            PantryItemRepository pantryItemRepository,
            StapleItemRepository stapleItemRepository,
            ShoppingListService shoppingListService,
            ScheduleService scheduleService,
            ProfileService profileService) {
        this.planEntryRepository = planEntryRepository;
        this.dishRepository = dishRepository;
        this.dishIngredientRepository = dishIngredientRepository;
        this.pantryItemRepository = pantryItemRepository;
        this.stapleItemRepository = stapleItemRepository;
        this.shoppingListService = shoppingListService;
        this.scheduleService = scheduleService;
        this.profileService = profileService;
    }

    /** Swaps the dishes, so positions, cooked state and meal slots stay where they are. */
    @Transactional
    public void swap(Long entryId, Long otherEntryId) {
        if (entryId.equals(otherEntryId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ein Gericht kann nicht mit sich selbst getauscht werden.");
        }
        PlanEntry entry = requireOwnEntry(entryId);
        PlanEntry other = requireOwnEntry(otherEntryId);
        Dish dish = entry.getDish();
        entry.setDish(other.getDish());
        other.setDish(dish);
    }

    @Transactional
    public void skip(Long entryId) {
        PlanEntry entry = requireOwnEntry(entryId);
        int lastSortOrder = planEntryRepository.findTopByPlanIdOrderBySortOrderDesc(entry.getPlan().getId())
                .map(PlanEntry::getSortOrder)
                .orElse(entry.getSortOrder());
        if (entry.getSortOrder() != lastSortOrder) {
            entry.setSortOrder(lastSortOrder + 1);
        }
    }

    @Transactional
    public void replaceDish(Long entryId, Long dishId) {
        PlanEntry entry = requireOwnEntry(entryId);
        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Gericht wurde nicht gefunden."));
        entry.setDish(dish);
    }

    @Transactional
    public void setMealSlot(Long entryId, MealSlot mealSlot) {
        requireOwnEntry(entryId).setMealSlot(mealSlot);
    }

    /** Dishes already in an active plan are reachable via swap, so suggestions come from the rest of the catalog. */
    @Transactional(readOnly = true)
    public List<ReplacementSuggestionDto> replacementSuggestions(Long entryId) {
        PlanEntry entry = requireOwnEntry(entryId);
        double portions = PortionCalculator.mealPortions(profileService.getProfile(), entry.getPlan(), entry.getMealSlot());
        List<MealPlan> activePlans = scheduleService.activePlans();
        Set<Long> activePlanDishIds = activePlans.isEmpty()
                ? Set.of()
                : planEntryRepository.findByPlanIdInOrderBySortOrderAsc(activePlans.stream().map(MealPlan::getId).toList())
                        .stream()
                        .map(planEntry -> planEntry.getDish().getId())
                        .collect(Collectors.toSet());
        List<Dish> candidates = dishRepository.search(null, null).stream()
                .filter(dish -> !dish.getId().equals(entry.getDish().getId()))
                .filter(dish -> !activePlanDishIds.contains(dish.getId()))
                .toList();
        if (candidates.isEmpty()) {
            return List.of();
        }
        Map<Long, List<DishIngredient>> ingredientsByDish = dishIngredientRepository
                .findByDishIdIn(candidates.stream().map(Dish::getId).toList())
                .stream()
                .collect(Collectors.groupingBy(ingredient -> ingredient.getDish().getId()));
        Map<String, Double> pantry = new HashMap<>();
        for (PantryItem item : pantryItemRepository.findAll()) {
            pantry.merge(ScheduleService.key(item.getIngredientName(), item.getUnit()), item.getQuantity(), Double::sum);
        }

        return candidates.stream()
                .map(dish -> {
                    List<DishIngredient> ingredients = ingredientsByDish.getOrDefault(dish.getId(), List.of());
                    double factor = PortionCalculator.ingredientFactor(dish, portions);
                    int missing = (int) ingredients.stream()
                            .filter(ingredient -> pantry.getOrDefault(
                                    ScheduleService.key(ingredient.getIngredient().getName(), ingredient.getIngredient().getUnit()),
                                    0.0) + ScheduleService.EPSILON < ingredient.getQuantityGrams() * factor)
                            .count();
                    int coverage = ingredients.isEmpty()
                            ? 0
                            : (int) Math.round(100.0 * (ingredients.size() - missing) / ingredients.size());
                    return new ReplacementSuggestionDto(
                            dish.getId(), dish.getName(), dish.getImageUrl(), dish.getPrepMinutes(),
                            ingredients.size(), missing, coverage);
                })
                .sorted(Comparator
                        .comparing((ReplacementSuggestionDto suggestion) -> suggestion.ingredientCount() == 0)
                        .thenComparing(ReplacementSuggestionDto::coveragePercent, Comparator.reverseOrder())
                        .thenComparing(ReplacementSuggestionDto::missingCount)
                        .thenComparing(ReplacementSuggestionDto::name, String.CASE_INSENSITIVE_ORDER))
                .limit(MAX_SUGGESTIONS)
                .toList();
    }

    @Transactional
    public List<ShoppingListItemDto> addMissingToShoppingList(Long entryId) {
        requireOwnEntry(entryId);
        Schedule schedule = scheduleService.compute(ScheduleService.MAX_DAYS);
        ScheduledMeal meal = schedule.meals().stream()
                .filter(candidate -> candidate.status() == MealStatus.PLANNED && entryId.equals(candidate.planEntryId()))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Das Gericht steht nicht in den nächsten Tagen an."));
        Map<String, Uncovered> uncovered = new LinkedHashMap<>();
        collect(uncovered, meal.needs());
        return addToShoppingList(uncovered);
    }

    /** Covers every planned meal until the next regular shopping trip plus the staple items. */
    @Transactional
    public List<ShoppingListItemDto> generateUpcomingShoppingList(Integer requestedDays) {
        int days = requestedDays != null ? requestedDays : ScheduleService.shoppingWindowDays(profileService.getProfile());
        Schedule schedule = scheduleService.compute(days);
        Map<String, Uncovered> uncovered = new LinkedHashMap<>();
        for (ScheduledMeal meal : schedule.meals()) {
            if (meal.status() == MealStatus.PLANNED) {
                collect(uncovered, meal.needs());
            }
        }
        for (StapleItem staple : stapleItemRepository.findAllByOrderByIngredientNameAsc()) {
            String key = ScheduleService.key(staple.getIngredientName(), staple.getUnit());
            double available = Math.max(0, schedule.pantryLeft().getOrDefault(key, 0.0))
                    + Math.max(0, schedule.listLeft().getOrDefault(key, 0.0));
            double missing = staple.getQuantity() - available;
            if (missing >= ScheduleService.EPSILON) {
                uncovered.computeIfAbsent(key, ignored -> new Uncovered(staple.getIngredientName(), staple.getUnit()))
                        .quantity += missing;
            }
        }
        return addToShoppingList(uncovered);
    }

    private List<ShoppingListItemDto> addToShoppingList(Map<String, Uncovered> uncovered) {
        for (Uncovered item : uncovered.values()) {
            // Scaled recipes yield e.g. 0.25 onions; shops only sell whole pieces.
            double quantity = COUNT_UNITS.contains(item.unit.trim().toLowerCase(Locale.ROOT))
                    ? Math.ceil(item.quantity - ScheduleService.EPSILON)
                    : item.quantity;
            shoppingListService.addItem(new CreateShoppingListItemRequest(item.name, quantity, item.unit));
        }
        return shoppingListService.getAllItems();
    }

    private static void collect(Map<String, Uncovered> target, List<IngredientNeed> needs) {
        for (IngredientNeed need : needs) {
            if (need.uncovered() > 0) {
                target.computeIfAbsent(
                                ScheduleService.key(need.ingredientName(), need.unit()),
                                ignored -> new Uncovered(need.ingredientName(), need.unit()))
                        .quantity += need.uncovered();
            }
        }
    }

    private PlanEntry requireOwnEntry(Long entryId) {
        return planEntryRepository.findById(entryId)
                .filter(entry -> entry.getPlan().getCreator() == null)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan-Eintrag wurde nicht gefunden."));
    }

    private static final class Uncovered {
        private final String name;
        private final String unit;
        private double quantity;

        Uncovered(String name, String unit) {
            this.name = name;
            this.unit = unit;
        }
    }
}
