package de.roman.speiseplan.pantry;

import de.roman.speiseplan.dish.Dish;
import de.roman.speiseplan.dish.DishIngredient;
import de.roman.speiseplan.dish.DishIngredientRepository;
import de.roman.speiseplan.dish.DishRepository;
import de.roman.speiseplan.ingredient.IngredientMatcher;
import de.roman.speiseplan.plan.MealSlot;
import de.roman.speiseplan.plan.PortionCalculator;
import de.roman.speiseplan.profile.ProfileService;
import de.roman.speiseplan.recommendation.RecommendationService;
import de.roman.speiseplan.recommendation.TasteService;
import de.roman.speiseplan.schedule.ScheduleService;
import de.roman.speiseplan.schedule.ScheduleService.IngredientNeed;
import de.roman.speiseplan.schedule.ScheduleService.MealStatus;
import de.roman.speiseplan.schedule.ScheduleService.Schedule;
import de.roman.speiseplan.schedule.ScheduleService.ScheduledMeal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * "Use soon" suggestions: one ranking that combines how urgently stock expires, how much of a dish is
 * already at home and how well the dish fits the user's taste. Stock that the upcoming plan uses up in
 * time is not treated as a problem.
 */
@Service
public class UseSoonService {
    private static final int MAX_SUGGESTIONS = 6;
    private static final double EXPIRED_URGENCY = 1.2;
    private static final double LIKED_SCORE = 2;

    private final PantryItemRepository pantryItemRepository;
    private final PantryService pantryService;
    private final DishRepository dishRepository;
    private final DishIngredientRepository dishIngredientRepository;
    private final ScheduleService scheduleService;
    private final ProfileService profileService;
    private final RecommendationService recommendationService;
    private final TasteService tasteService;

    public UseSoonService(
            PantryItemRepository pantryItemRepository,
            PantryService pantryService,
            DishRepository dishRepository,
            DishIngredientRepository dishIngredientRepository,
            ScheduleService scheduleService,
            ProfileService profileService,
            RecommendationService recommendationService,
            TasteService tasteService) {
        this.pantryItemRepository = pantryItemRepository;
        this.pantryService = pantryService;
        this.dishRepository = dishRepository;
        this.dishIngredientRepository = dishIngredientRepository;
        this.scheduleService = scheduleService;
        this.profileService = profileService;
        this.recommendationService = recommendationService;
        this.tasteService = tasteService;
    }

    @Transactional(readOnly = true)
    public UseSoonDto useSoon(String ownerEmail) {
        return useSoon(ownerEmail, null);
    }

    /** {@code upcoming} may be an already computed schedule covering at least the expiry window. */
    @Transactional(readOnly = true)
    public UseSoonDto useSoon(String ownerEmail, Schedule upcoming) {
        LocalDate today = PantryService.today();
        long wastedThisMonth = pantryService.countWastedThisMonth();
        LocalDate limit = today.plusDays(PantryService.EXPIRING_SOON_DAYS);
        List<PantryItem> expiring = upcoming == null
                ? pantryItemRepository.findByExpiresOnLessThanEqualOrderByExpiresOnAsc(limit)
                : upcoming.pantryItems().stream()
                        .filter(item -> item.getExpiresOn() != null && !item.getExpiresOn().isAfter(limit))
                        .sorted(Comparator.comparing(PantryItem::getExpiresOn))
                        .toList();
        if (expiring.isEmpty()) {
            return new UseSoonDto(List.of(), List.of(), null, wastedThisMonth);
        }

        int days = PantryService.EXPIRING_SOON_DAYS + 1;
        Schedule schedule = upcoming != null && upcoming.days() >= days ? upcoming : scheduleService.compute(days);
        List<ScheduledMeal> planned = schedule.meals().stream()
                .filter(meal -> meal.status() == MealStatus.PLANNED && meal.dayOffset() < days)
                .toList();
        Map<String, double[]> plannedUse = new HashMap<>();
        for (ScheduledMeal meal : planned) {
            for (IngredientNeed need : meal.needs()) {
                plannedUse.computeIfAbsent(need.key(), key -> new double[days])[meal.dayOffset()] += need.pantryUsedBase();
            }
        }

        // Cooking takes the soonest-expiring stock first, so planned use is attributed in expiry order.
        Map<String, Double> attributed = new HashMap<>();
        Map<String, Double> openUrgency = new HashMap<>();
        List<UseSoonDto.Item> items = new ArrayList<>();
        for (PantryItem item : expiring) {
            IngredientMatcher.Amount amount =
                    IngredientMatcher.normalize(item.getIngredientName(), item.getUnit(), item.getQuantity());
            int daysLeft = (int) ChronoUnit.DAYS.between(today, item.getExpiresOn());
            int deadline = Math.max(0, Math.min(days - 1, daysLeft));
            double plannedUntilDeadline = 0;
            double[] perDay = plannedUse.get(amount.key());
            for (int offset = 0; perDay != null && offset <= deadline; offset++) {
                plannedUntilDeadline += perDay[offset];
            }
            double covered = Math.min(
                    amount.quantity(), Math.max(0, plannedUntilDeadline - attributed.getOrDefault(amount.key(), 0.0)));
            attributed.merge(amount.key(), covered, Double::sum);
            boolean usedByPlan = amount.quantity() - covered <= amount.quantity() * 0.05 + 1e-6;
            if (!usedByPlan) {
                openUrgency.merge(
                        amount.key(), daysLeft < 0 ? EXPIRED_URGENCY : 1.0 / (1 + daysLeft), Math::max);
            }
            items.add(new UseSoonDto.Item(
                    item.getId(), item.getIngredientName(), item.getQuantity(), item.getUnit(), item.getPurchasedAt(),
                    item.getExpiresOn(), usedByPlan));
        }

        return new UseSoonDto(
                items,
                openUrgency.isEmpty() ? List.of() : suggest(openUrgency, planned, schedule.pantryItems(), ownerEmail),
                todayEntry(planned),
                wastedThisMonth);
    }

    private List<UseSoonDto.DishSuggestion> suggest(
            Map<String, Double> openUrgency, List<ScheduledMeal> planned, List<PantryItem> pantryItems,
            String ownerEmail) {
        Set<Long> excluded = new HashSet<>(tasteService.hiddenDishIds());
        excluded.addAll(recommendationService.dislikedDishIds(ownerEmail));
        // Dishes of the next days are already accounted for in the planned use
        planned.forEach(meal -> excluded.add(meal.dish().getId()));
        List<Dish> dishes = dishRepository.findAll().stream()
                .filter(dish -> !excluded.contains(dish.getId()))
                .toList();
        if (dishes.isEmpty()) {
            return List.of();
        }
        Map<Long, List<DishIngredient>> ingredientsByDish = dishIngredientRepository
                .findByDishIdIn(dishes.stream().map(Dish::getId).toList())
                .stream()
                .collect(Collectors.groupingBy(entry -> entry.getDish().getId()));
        Map<String, Double> pantry = ScheduleService.pantryStock(pantryItems);
        Map<String, Double> taste = recommendationService.tasteProfile(ownerEmail);
        double portions = PortionCalculator.householdPortions(profileService.getProfile());

        List<Scored> scored = new ArrayList<>();
        for (Dish dish : dishes) {
            List<DishIngredient> ingredients = ingredientsByDish.getOrDefault(dish.getId(), List.of());
            Set<String> matched = new LinkedHashSet<>();
            Set<String> matchedKeys = new HashSet<>();
            double urgency = 0;
            for (DishIngredient ingredient : ingredients) {
                String key = IngredientMatcher.key(
                        ingredient.getIngredient().getName(), ingredient.getIngredient().getUnit());
                Double keyUrgency = openUrgency.get(key);
                if (keyUrgency != null && matchedKeys.add(key)) {
                    matched.add(ingredient.getIngredient().getName());
                    urgency += keyUrgency;
                }
            }
            if (matched.isEmpty()) {
                continue;
            }
            int missing = ScheduleService.missingCount(
                    ingredients, PortionCalculator.ingredientFactor(dish, portions), pantry);
            double coverage = (ingredients.size() - missing) / (double) ingredients.size();
            double tasteScore = RecommendationService.personalScore(taste, dish.getTags());
            double score = urgency * (0.5 + 0.5 * coverage) * (1 + 0.5 * Math.tanh(tasteScore / 8));
            scored.add(new Scored(
                    score,
                    new UseSoonDto.DishSuggestion(
                            dish.getId(), dish.getName(), dish.getImageUrl(), dish.getPrepMinutes(),
                            List.copyOf(matched), missing, (int) Math.round(coverage * 100),
                            tasteScore >= LIKED_SCORE)));
        }
        // Copied plans bring the same dish several times; the best-ranked copy is enough.
        Set<String> seenNames = new HashSet<>();
        return scored.stream()
                .sorted(Comparator.comparingDouble(Scored::score)
                        .reversed()
                        .thenComparing(entry -> entry.suggestion().name(), String.CASE_INSENSITIVE_ORDER))
                .map(Scored::suggestion)
                .filter(suggestion -> seenNames.add(suggestion.name().trim().toLowerCase(Locale.ROOT)))
                .limit(MAX_SUGGESTIONS)
                .toList();
    }

    /** The meal a suggestion would replace: on the earliest day with an open meal, dinner if planned. */
    private static UseSoonDto.TodayEntry todayEntry(List<ScheduledMeal> planned) {
        if (planned.isEmpty()) {
            return null;
        }
        int firstDay = planned.getFirst().dayOffset();
        List<ScheduledMeal> sameDay = planned.stream().filter(meal -> meal.dayOffset() == firstDay).toList();
        ScheduledMeal target = sameDay.stream()
                .filter(meal -> meal.slot() == MealSlot.DINNER)
                .findFirst()
                .orElse(sameDay.getFirst());
        return new UseSoonDto.TodayEntry(
                target.planEntryId(), target.dish().getId(), target.dish().getName(), target.dayOffset());
    }

    private record Scored(double score, UseSoonDto.DishSuggestion suggestion) {
    }
}
