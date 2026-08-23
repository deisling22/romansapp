package de.roman.speiseplan.dashboard;

import de.roman.speiseplan.dish.Dish;
import de.roman.speiseplan.dish.DishIngredient;
import de.roman.speiseplan.dish.DishIngredientRepository;
import de.roman.speiseplan.dish.DishNutritionCalculator;
import de.roman.speiseplan.dish.DishRatingRepository;
import de.roman.speiseplan.plan.PlanEntry;
import de.roman.speiseplan.plan.PlanEntryRepository;
import de.roman.speiseplan.pantry.PantryService;
import de.roman.speiseplan.profile.ProfileDto;
import de.roman.speiseplan.profile.ProfileService;
import de.roman.speiseplan.shopping.ShoppingListService;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class DashboardService {
    private final PlanEntryRepository planEntryRepository;
    private final DishIngredientRepository dishIngredientRepository;
    private final DishRatingRepository dishRatingRepository;
    private final ProfileService profileService;
    private final ShoppingListService shoppingListService;
    private final PantryService pantryService;

    public DashboardService(
            PlanEntryRepository planEntryRepository,
            DishIngredientRepository dishIngredientRepository,
            DishRatingRepository dishRatingRepository,
            ProfileService profileService,
            ShoppingListService shoppingListService,
            PantryService pantryService) {
        this.planEntryRepository = planEntryRepository;
        this.dishIngredientRepository = dishIngredientRepository;
        this.dishRatingRepository = dishRatingRepository;
        this.profileService = profileService;
        this.shoppingListService = shoppingListService;
        this.pantryService = pantryService;
    }


    @Transactional(readOnly = true)
    public DashboardDto getDashboard() {
        ProfileDto profile = profileService.getProfile();

        LocalDate today = LocalDate.now(ZoneId.systemDefault());
        Instant startOfDay = today.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endOfDay = today.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

        List<PlanEntry> cookedToday = planEntryRepository.findByCookedTrueAndCookedAtBetween(startOfDay, endOfDay);
        Map<Long, List<DishIngredient>> ingredientsByDish = loadIngredients(
                cookedToday.stream().map(entry -> entry.getDish().getId()).distinct().toList());

        double caloriesToday = 0;
        double proteinToday = 0;
        for (PlanEntry entry : cookedToday) {
            Dish dish = entry.getDish();
            List<DishIngredient> ingredients = ingredientsByDish.getOrDefault(dish.getId(), List.of());
            double perServingCalories = DishNutritionCalculator.caloriesPerServing(ingredients, dish.getServings());
            double perServingProtein = DishNutritionCalculator.proteinPerServing(ingredients, dish.getServings());
            caloriesToday += perServingCalories * profile.defaultPortionSize();
            proteinToday += perServingProtein * profile.defaultPortionSize();
        }

        Double proteinGoal = profile.bodyWeightKg() == null ? null : profile.bodyWeightKg() * 2;
        Integer proteinPercent = proteinGoal == null || proteinGoal == 0
                ? null
                : (int) Math.round(proteinToday / proteinGoal * 100);

        NextDishDto nextDish = planEntryRepository.findFirstByCookedFalseOrderByPlanIdAscSortOrderAsc()
                .map(entry -> {
                    Dish nextDishEntity = entry.getDish();
                    DishRatingRepository.DishRatingSummaryProjection summary = dishRatingRepository
                            .summarizeByDishIds(List.of(nextDishEntity.getId()))
                            .stream()
                            .findFirst()
                            .orElse(null);
                    return new NextDishDto(
                            entry.getId(),
                            entry.getPlan().getId(),
                            nextDishEntity.getId(),
                            nextDishEntity.getName(),
                            nextDishEntity.getImageUrl(),
                            summary == null ? null : summary.getAverageRating(),
                            summary == null ? 0 : summary.getRatingCount().intValue());
                })
                .orElse(null);

        return new DashboardDto(
            caloriesToday,
            proteinToday,
            proteinGoal,
            proteinPercent,
            nextDish,
            shoppingListService.countItems(),
            pantryService.countItems());
    }

    @Transactional
    public void markCooked(Long planEntryId) {
        PlanEntry entry = planEntryRepository.findById(planEntryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan-Eintrag wurde nicht gefunden."));
        if (entry.isCooked()) {
            return;
        }
        pantryService.consume(dishIngredientRepository.findByDishId(entry.getDish().getId()));
        entry.markCooked(Instant.now());
    }

    private Map<Long, List<DishIngredient>> loadIngredients(List<Long> dishIds) {
        if (dishIds.isEmpty()) {
            return Map.of();
        }
        return dishIngredientRepository.findByDishIdIn(dishIds).stream()
                .collect(Collectors.groupingBy(entry -> entry.getDish().getId()));
    }
}
