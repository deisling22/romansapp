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
import de.roman.speiseplan.recommendation.ContentType;
import de.roman.speiseplan.recommendation.TrendScoringService;
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
    private final TrendScoringService trendScoringService;

    public DashboardService(
            PlanEntryRepository planEntryRepository,
            DishIngredientRepository dishIngredientRepository,
            DishRatingRepository dishRatingRepository,
            ProfileService profileService,
            ShoppingListService shoppingListService,
            PantryService pantryService,
            TrendScoringService trendScoringService) {
        this.planEntryRepository = planEntryRepository;
        this.dishIngredientRepository = dishIngredientRepository;
        this.dishRatingRepository = dishRatingRepository;
        this.profileService = profileService;
        this.shoppingListService = shoppingListService;
        this.pantryService = pantryService;
        this.trendScoringService = trendScoringService;
    }


    @Transactional(readOnly = true)
    public DashboardDto getDashboard() {
        ProfileDto profile = profileService.getProfile();

        LocalDate today = LocalDate.now(ZoneId.systemDefault());
        Instant startOfDay = today.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endOfDay = today.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

        List<PlanEntry> cookedToday = planEntryRepository
            .findByPlanCreatorIsNullAndCookedTrueAndCookedAtBetween(startOfDay, endOfDay);
        Map<Long, List<DishIngredient>> ingredientsByDish = loadIngredients(
                cookedToday.stream().map(entry -> entry.getDish().getId()).distinct().toList());

        double caloriesToday = 0;
        double proteinToday = 0;
        double carbsToday = 0;
        double fatToday = 0;
        double vitaminAToday = 0;
        double vitaminCToday = 0;
        double vitaminDToday = 0;
        double vitaminKToday = 0;
        double vitaminB12Today = 0;
        double folateToday = 0;
        for (PlanEntry entry : cookedToday) {
            Dish dish = entry.getDish();
            List<DishIngredient> ingredients = ingredientsByDish.getOrDefault(dish.getId(), List.of());
            double perServingCalories = DishNutritionCalculator.caloriesPerServing(ingredients, dish.getServings());
            double perServingProtein = DishNutritionCalculator.proteinPerServing(ingredients, dish.getServings());
            caloriesToday += perServingCalories * profile.defaultPortionSize();
            proteinToday += perServingProtein * profile.defaultPortionSize();
            carbsToday += orZero(dish.getCarbsGrams()) * profile.defaultPortionSize();
            fatToday += orZero(dish.getFatGrams()) * profile.defaultPortionSize();
            vitaminAToday += orZero(dish.getVitaminAMcg()) * profile.defaultPortionSize();
            vitaminCToday += orZero(dish.getVitaminCMg()) * profile.defaultPortionSize();
            vitaminDToday += orZero(dish.getVitaminDMcg()) * profile.defaultPortionSize();
            vitaminKToday += orZero(dish.getVitaminKMcg()) * profile.defaultPortionSize();
            vitaminB12Today += orZero(dish.getVitaminB12Mcg()) * profile.defaultPortionSize();
            folateToday += orZero(dish.getFolateMcg()) * profile.defaultPortionSize();
        }

        Double proteinGoal = profile.bodyWeightKg() == null ? null : profile.bodyWeightKg() * 2;
        Integer proteinPercent = proteinGoal == null || proteinGoal == 0
                ? null
                : (int) Math.round(proteinToday / proteinGoal * 100);

        Double calorieGoal = profile.calorieGoal();
        Integer caloriePercent = calorieGoal == null || calorieGoal == 0
                ? null
                : (int) Math.round(caloriesToday / calorieGoal * 100);

        NextDishDto nextDish = planEntryRepository
            .findFirstByPlanCreatorIsNullAndCookedFalseOrderByPlanIdAscSortOrderAsc()
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
            calorieGoal,
            caloriePercent,
            proteinToday,
            proteinGoal,
            proteinPercent,
            profile.nutritionTrackingEnabled(),
            carbsToday,
            fatToday,
            vitaminAToday,
            vitaminCToday,
            vitaminDToday,
            vitaminKToday,
            vitaminB12Today,
            folateToday,
            nextDish,
            shoppingListService.countItems(),
            pantryService.countItems());
    }

    private static double orZero(Double value) {
        return value == null ? 0 : value;
    }

    @Transactional
    public void markCooked(Long planEntryId) {
        PlanEntry entry = planEntryRepository.findById(planEntryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan-Eintrag wurde nicht gefunden."));
        if (entry.getPlan().getCreator() != null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan-Eintrag wurde nicht gefunden.");
        }
        if (entry.isCooked()) {
            return;
        }
        pantryService.consume(dishIngredientRepository.findByDishId(entry.getDish().getId()));
        entry.markCooked(Instant.now());
        trendScoringService.bump(ContentType.DISH, entry.getDish().getId(), 4);
    }

    private Map<Long, List<DishIngredient>> loadIngredients(List<Long> dishIds) {
        if (dishIds.isEmpty()) {
            return Map.of();
        }
        return dishIngredientRepository.findByDishIdIn(dishIds).stream()
                .collect(Collectors.groupingBy(entry -> entry.getDish().getId()));
    }
}
