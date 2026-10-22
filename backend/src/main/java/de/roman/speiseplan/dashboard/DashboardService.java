package de.roman.speiseplan.dashboard;

import de.roman.speiseplan.cost.CostSummaryService;
import de.roman.speiseplan.dish.Dish;
import de.roman.speiseplan.dish.DishIngredient;
import de.roman.speiseplan.dish.DishIngredientRepository;
import de.roman.speiseplan.dish.DishNutritionCalculator;
import de.roman.speiseplan.dish.DishRatingRepository;
import de.roman.speiseplan.plan.CookLog;
import de.roman.speiseplan.plan.CookLogRepository;
import de.roman.speiseplan.pantry.PantryService;
import de.roman.speiseplan.profile.ProfileDto;
import de.roman.speiseplan.profile.ProfileService;
import de.roman.speiseplan.schedule.CookingService;
import de.roman.speiseplan.schedule.ScheduleService;
import de.roman.speiseplan.shopping.ShoppingListService;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {
    private final CookLogRepository cookLogRepository;
    private final DishIngredientRepository dishIngredientRepository;
    private final DishRatingRepository dishRatingRepository;
    private final ProfileService profileService;
    private final ShoppingListService shoppingListService;
    private final PantryService pantryService;
    private final ScheduleService scheduleService;
    private final CookingService cookingService;
    private final CostSummaryService costSummaryService;

    public DashboardService(
            CookLogRepository cookLogRepository,
            DishIngredientRepository dishIngredientRepository,
            DishRatingRepository dishRatingRepository,
            ProfileService profileService,
            ShoppingListService shoppingListService,
            PantryService pantryService,
            ScheduleService scheduleService,
            CookingService cookingService,
            CostSummaryService costSummaryService) {
        this.costSummaryService = costSummaryService;
        this.cookLogRepository = cookLogRepository;
        this.dishIngredientRepository = dishIngredientRepository;
        this.dishRatingRepository = dishRatingRepository;
        this.profileService = profileService;
        this.shoppingListService = shoppingListService;
        this.pantryService = pantryService;
        this.scheduleService = scheduleService;
        this.cookingService = cookingService;
    }


    @Transactional(readOnly = true)
    public DashboardDto getDashboard() {
        ProfileDto profile = profileService.getProfile();

        LocalDate today = LocalDate.now(ZoneId.systemDefault());
        Instant startOfDay = today.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endOfDay = today.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

        List<CookLog> cookedToday = cookLogRepository
            .findByCookedAtGreaterThanEqualAndCookedAtLessThanOrderByCookedAtAsc(startOfDay, endOfDay);
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
        for (CookLog entry : cookedToday) {
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

        NextDishDto nextDish = scheduleService.compute(2).meals().stream()
                .filter(meal -> meal.status() == ScheduleService.MealStatus.PLANNED)
                .findFirst()
                .map(meal -> {
                    Dish nextDishEntity = meal.dish();
                    DishRatingRepository.DishRatingSummaryProjection summary = dishRatingRepository
                            .summarizeByDishIds(List.of(nextDishEntity.getId()))
                            .stream()
                            .findFirst()
                            .orElse(null);
                    return new NextDishDto(
                            meal.planEntryId(),
                            meal.plan().getId(),
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
            pantryService.countItems(),
            profile.costTrackingEnabled(),
            profile.costTrackingEnabled() ? costSummaryService.summarize(profile) : null,
            pantryService.countExpiringSoon());
    }

    /** Nutrition of the last 7 days (today included), one entry per day, oldest first. */
    @Transactional(readOnly = true)
    public WeekNutritionDto getWeek() {
        ProfileDto profile = profileService.getProfile();
        ZoneId zone = ZoneId.systemDefault();
        LocalDate today = LocalDate.now(zone);
        LocalDate first = today.minusDays(6);
        List<CookLog> logs = cookLogRepository.findByCookedAtGreaterThanEqualAndCookedAtLessThanOrderByCookedAtAsc(
                first.atStartOfDay(zone).toInstant(), today.plusDays(1).atStartOfDay(zone).toInstant());
        Map<Long, List<DishIngredient>> ingredientsByDish = loadIngredients(
                logs.stream().map(entry -> entry.getDish().getId()).distinct().toList());
        Map<LocalDate, List<CookLog>> byDay = logs.stream()
                .collect(Collectors.groupingBy(entry -> LocalDate.ofInstant(entry.getCookedAt(), zone)));

        double portion = profile.defaultPortionSize();
        List<WeekNutritionDto.Day> days = new java.util.ArrayList<>();
        for (LocalDate day = first; !day.isAfter(today); day = day.plusDays(1)) {
            double calories = 0;
            double protein = 0;
            double carbs = 0;
            double fat = 0;
            List<CookLog> dayLogs = byDay.getOrDefault(day, List.of());
            for (CookLog entry : dayLogs) {
                Dish dish = entry.getDish();
                List<DishIngredient> ingredients = ingredientsByDish.getOrDefault(dish.getId(), List.of());
                calories += DishNutritionCalculator.caloriesPerServing(ingredients, dish.getServings()) * portion;
                protein += DishNutritionCalculator.proteinPerServing(ingredients, dish.getServings()) * portion;
                carbs += orZero(dish.getCarbsGrams()) * portion;
                fat += orZero(dish.getFatGrams()) * portion;
            }
            days.add(new WeekNutritionDto.Day(day, dayLogs.size(), calories, protein, carbs, fat));
        }

        List<WeekNutritionDto.Day> tracked = days.stream().filter(day -> day.meals() > 0).toList();
        Double proteinGoal = profile.bodyWeightKg() == null ? null : profile.bodyWeightKg() * 2;
        return new WeekNutritionDto(
                days,
                tracked.size(),
                average(tracked, WeekNutritionDto.Day::calories),
                average(tracked, WeekNutritionDto.Day::protein),
                average(tracked, WeekNutritionDto.Day::carbs),
                average(tracked, WeekNutritionDto.Day::fat),
                profile.calorieGoal(),
                proteinGoal);
    }

    private static double average(
            List<WeekNutritionDto.Day> days, java.util.function.ToDoubleFunction<WeekNutritionDto.Day> value) {
        return days.stream().mapToDouble(value).average().orElse(0);
    }

    private static double orZero(Double value) {
        return value == null ? 0 : value;
    }

    @Transactional
    public void markCooked(Long planEntryId) {
        cookingService.markCooked(planEntryId);
    }

    private Map<Long, List<DishIngredient>> loadIngredients(List<Long> dishIds) {
        if (dishIds.isEmpty()) {
            return Map.of();
        }
        return dishIngredientRepository.findByDishIdIn(dishIds).stream()
                .collect(Collectors.groupingBy(entry -> entry.getDish().getId()));
    }
}
