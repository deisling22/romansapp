package de.roman.speiseplan.schedule;

import de.roman.speiseplan.dish.Dish;
import de.roman.speiseplan.dish.DishIngredient;
import de.roman.speiseplan.dish.DishIngredientRepository;
import de.roman.speiseplan.dish.DishRepository;
import de.roman.speiseplan.pantry.PantryItemRepository;
import de.roman.speiseplan.pantry.PantryService;
import de.roman.speiseplan.plan.CookLog;
import de.roman.speiseplan.plan.CookLogRepository;
import de.roman.speiseplan.plan.MealSlot;
import de.roman.speiseplan.plan.PortionCalculator;
import de.roman.speiseplan.profile.ProfileService;
import de.roman.speiseplan.recommendation.ContentType;
import de.roman.speiseplan.recommendation.TrendScoringService;
import de.roman.speiseplan.schedule.DishActionDtos.CookDishRequest;
import de.roman.speiseplan.schedule.DishActionDtos.CookedDto;
import de.roman.speiseplan.schedule.DishActionDtos.DishAvailabilityDto;
import de.roman.speiseplan.schedule.DishActionDtos.IngredientAvailabilityDto;
import de.roman.speiseplan.schedule.ScheduleService.IngredientNeed;
import de.roman.speiseplan.schedule.ScheduleService.MealStatus;
import de.roman.speiseplan.shopping.ShoppingListItemDto;
import de.roman.speiseplan.shopping.ShoppingListItemRepository;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/** Actions on a dish that do not need a plan entry: check stock, shop for it, cook it. */
@Service
public class DishActionService {
    private static final int DUE_WINDOW_DAYS = 7;

    private final DishRepository dishRepository;
    private final DishIngredientRepository dishIngredientRepository;
    private final PantryItemRepository pantryItemRepository;
    private final ShoppingListItemRepository shoppingListItemRepository;
    private final CookLogRepository cookLogRepository;
    private final PantryService pantryService;
    private final CookingService cookingService;
    private final ScheduleService scheduleService;
    private final PlanEntryActionService planEntryActionService;
    private final ProfileService profileService;
    private final TrendScoringService trendScoringService;

    public DishActionService(
            DishRepository dishRepository,
            DishIngredientRepository dishIngredientRepository,
            PantryItemRepository pantryItemRepository,
            ShoppingListItemRepository shoppingListItemRepository,
            CookLogRepository cookLogRepository,
            PantryService pantryService,
            CookingService cookingService,
            ScheduleService scheduleService,
            PlanEntryActionService planEntryActionService,
            ProfileService profileService,
            TrendScoringService trendScoringService) {
        this.dishRepository = dishRepository;
        this.dishIngredientRepository = dishIngredientRepository;
        this.pantryItemRepository = pantryItemRepository;
        this.shoppingListItemRepository = shoppingListItemRepository;
        this.cookLogRepository = cookLogRepository;
        this.pantryService = pantryService;
        this.cookingService = cookingService;
        this.scheduleService = scheduleService;
        this.planEntryActionService = planEntryActionService;
        this.profileService = profileService;
        this.trendScoringService = trendScoringService;
    }

    @Transactional(readOnly = true)
    public DishAvailabilityDto availability(Long dishId, Double servings) {
        Dish dish = requireDish(dishId);
        double portions = portions(servings);
        return new DishAvailabilityDto(
                portions,
                needs(dish, portions).stream()
                        .map(need -> new IngredientAvailabilityDto(
                                need.ingredientName(), need.unit(), need.required(), need.missing(), need.uncovered()))
                        .toList());
    }

    @Transactional
    public List<ShoppingListItemDto> addMissingToShoppingList(Long dishId, Double servings) {
        Dish dish = requireDish(dishId);
        Map<String, PlanEntryActionService.Uncovered> uncovered = new LinkedHashMap<>();
        PlanEntryActionService.collect(uncovered, needs(dish, portions(servings)));
        return planEntryActionService.addToShoppingList(uncovered);
    }

    /**
     * Cooks a dish from anywhere in the app. If it is coming up in an active plan, that entry is ticked
     * off so the rotation moves on; otherwise it is logged as a spontaneous meal and today's plan shifts.
     */
    @Transactional
    public CookedDto cook(Long dishId, CookDishRequest request) {
        Dish dish = requireDish(dishId);
        Optional<Long> dueEntryId = scheduleService.compute(DUE_WINDOW_DAYS).meals().stream()
                .filter(meal -> meal.status() == MealStatus.PLANNED && meal.dish().getId().equals(dishId))
                .map(ScheduleService.ScheduledMeal::planEntryId)
                .findFirst();
        if (dueEntryId.isPresent()) {
            cookingService.markCooked(dueEntryId.get());
            return new CookedDto(dishId, dueEntryId.get());
        }

        double portions = portions(request == null ? null : request.servings());
        MealSlot slot = request == null || request.mealSlot() == null ? MealSlot.DINNER : request.mealSlot();
        pantryService.consume(
                dishIngredientRepository.findByDishId(dishId), PortionCalculator.ingredientFactor(dish, portions));
        cookLogRepository.save(new CookLog(dish, slot, Instant.now()));
        trendScoringService.bump(ContentType.DISH, dishId, 4);
        return new CookedDto(dishId, null);
    }

    private List<IngredientNeed> needs(Dish dish, double portions) {
        List<DishIngredient> ingredients = dishIngredientRepository.findByDishId(dish.getId());
        return ScheduleService.allocate(
                ingredients,
                PortionCalculator.ingredientFactor(dish, portions),
                ScheduleService.pantryStock(pantryItemRepository.findAll()),
                ScheduleService.listStock(shoppingListItemRepository.findAll()));
    }

    private double portions(Double servings) {
        return servings != null && servings > 0
                ? servings
                : PortionCalculator.householdPortions(profileService.getProfile());
    }

    private Dish requireDish(Long dishId) {
        return dishRepository.findById(dishId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Gericht wurde nicht gefunden."));
    }
}
