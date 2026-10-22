package de.roman.speiseplan.schedule;

import de.roman.speiseplan.dish.Dish;
import de.roman.speiseplan.dish.DishIngredient;
import de.roman.speiseplan.dish.DishIngredientRepository;
import de.roman.speiseplan.pantry.PantryItem;
import de.roman.speiseplan.pantry.PantryItemRepository;
import de.roman.speiseplan.plan.CookLog;
import de.roman.speiseplan.plan.CookLogRepository;
import de.roman.speiseplan.plan.MealPlan;
import de.roman.speiseplan.plan.MealPlanRepository;
import de.roman.speiseplan.plan.MealSlot;
import de.roman.speiseplan.plan.PlanEntry;
import de.roman.speiseplan.plan.PlanEntryRepository;
import de.roman.speiseplan.plan.PortionCalculator;
import de.roman.speiseplan.profile.ProfileDto;
import de.roman.speiseplan.profile.ProfileService;
import de.roman.speiseplan.schedule.ScheduleDtos.MissingIngredientDto;
import de.roman.speiseplan.schedule.ScheduleDtos.ScheduleDayDto;
import de.roman.speiseplan.schedule.ScheduleDtos.ScheduleDto;
import de.roman.speiseplan.schedule.ScheduleDtos.ScheduledMealDto;
import de.roman.speiseplan.shopping.ShoppingListItem;
import de.roman.speiseplan.shopping.ShoppingListItemRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Derives the upcoming meals from the rotation order of all active plans (no fixed weekdays):
 * per meal slot the plans take turns, each plan cycles through its entries endlessly.
 */
@Service
public class ScheduleService {
    public static final int MAX_DAYS = 14;
    static final double EPSILON = 0.01;

    private final MealPlanRepository mealPlanRepository;
    private final PlanEntryRepository planEntryRepository;
    private final CookLogRepository cookLogRepository;
    private final DishIngredientRepository dishIngredientRepository;
    private final PantryItemRepository pantryItemRepository;
    private final ShoppingListItemRepository shoppingListItemRepository;
    private final ProfileService profileService;

    public ScheduleService(
            MealPlanRepository mealPlanRepository,
            PlanEntryRepository planEntryRepository,
            CookLogRepository cookLogRepository,
            DishIngredientRepository dishIngredientRepository,
            PantryItemRepository pantryItemRepository,
            ShoppingListItemRepository shoppingListItemRepository,
            ProfileService profileService) {
        this.mealPlanRepository = mealPlanRepository;
        this.planEntryRepository = planEntryRepository;
        this.cookLogRepository = cookLogRepository;
        this.dishIngredientRepository = dishIngredientRepository;
        this.pantryItemRepository = pantryItemRepository;
        this.shoppingListItemRepository = shoppingListItemRepository;
        this.profileService = profileService;
    }

    public enum MealStatus {
        COOKED,
        PLANNED,
        LEFTOVERS
    }

    public record IngredientNeed(String ingredientName, String unit, double required, double missing, double uncovered) {
    }

    public record ScheduledMeal(
            int dayOffset,
            MealSlot slot,
            MealStatus status,
            Long planEntryId,
            MealPlan plan,
            Dish dish,
            double portions,
            boolean cooksLeftovers,
            List<IngredientNeed> needs) {
    }

    /** Stock maps hold what is still unallocated after all meals of the schedule were served. */
    public record Schedule(
            LocalDate startDate, int days, List<ScheduledMeal> meals,
            Map<String, Double> pantryLeft, Map<String, Double> listLeft) {
    }

    @Transactional(readOnly = true)
    public ScheduleDto getSchedule(int days) {
        Schedule schedule = compute(days);
        int windowDays = shoppingWindowDays(profileService.getProfile());
        List<ScheduleDayDto> dayDtos = new ArrayList<>();
        for (int offset = 0; offset < schedule.days(); offset++) {
            int currentOffset = offset;
            List<ScheduledMealDto> meals = schedule.meals().stream()
                    .filter(meal -> meal.dayOffset() == currentOffset)
                    .map(ScheduleService::toDto)
                    .toList();
            dayDtos.add(new ScheduleDayDto(offset, schedule.startDate().plusDays(offset), meals));
        }
        return new ScheduleDto(dayDtos, windowDays);
    }

    @Transactional(readOnly = true)
    public Schedule compute(int requestedDays) {
        int days = Math.max(1, Math.min(MAX_DAYS, requestedDays));
        ProfileDto profile = profileService.getProfile();
        ZoneId zone = ZoneId.systemDefault();
        LocalDate today = LocalDate.now(zone);
        Instant startOfYesterday = today.minusDays(1).atStartOfDay(zone).toInstant();
        Instant startOfToday = today.atStartOfDay(zone).toInstant();
        Instant startOfTomorrow = today.plusDays(1).atStartOfDay(zone).toInstant();

        List<MealPlan> plans = activePlans();
        List<PlanEntry> entries = plans.isEmpty()
                ? List.of()
                : planEntryRepository.findByPlanIdInOrderBySortOrderAsc(plans.stream().map(MealPlan::getId).toList());
        Map<MealSlot, SlotQueue> queues = buildQueues(plans, entries);
        Map<Long, List<DishIngredient>> ingredientsByDish = entries.isEmpty()
                ? Map.of()
                : dishIngredientRepository
                        .findByDishIdIn(entries.stream().map(entry -> entry.getDish().getId()).distinct().toList())
                        .stream()
                        .collect(Collectors.groupingBy(ingredient -> ingredient.getDish().getId()));

        List<CookLog> recentLogs = cookLogRepository
                .findByCookedAtGreaterThanEqualAndCookedAtLessThanOrderByCookedAtAsc(startOfYesterday, startOfTomorrow);
        Map<MealSlot, List<CookLog>> todayLogs = new EnumMap<>(MealSlot.class);
        Dish pendingLeftover = null;
        for (CookLog log : recentLogs) {
            if (log.getCookedAt().isBefore(startOfToday)) {
                if (log.getMealSlot() == MealSlot.DINNER) {
                    pendingLeftover = log.isLeftovers() ? log.getDish() : null;
                }
            } else {
                todayLogs.computeIfAbsent(log.getMealSlot(), slot -> new ArrayList<>()).add(log);
            }
        }
        Map<Long, MealPlan> plansById = mealPlanRepository.findAllByCreatorIsNullOrderByCreatedAtAsc().stream()
                .collect(Collectors.toMap(MealPlan::getId, plan -> plan));

        Map<String, Double> pantryLeft = new HashMap<>();
        for (PantryItem item : pantryItemRepository.findAll()) {
            pantryLeft.merge(key(item.getIngredientName(), item.getUnit()), item.getQuantity(), Double::sum);
        }
        Map<String, Double> listLeft = new HashMap<>();
        for (ShoppingListItem item : shoppingListItemRepository.findAll()) {
            listLeft.merge(key(item.getIngredientName(), item.getUnit()), item.getQuantity(), Double::sum);
        }

        List<ScheduledMeal> meals = new ArrayList<>();
        for (int offset = 0; offset < days; offset++) {
            Dish leftoverForTomorrow = null;
            for (MealSlot slot : MealSlot.values()) {
                if (offset == 0 && todayLogs.containsKey(slot)) {
                    for (CookLog log : todayLogs.get(slot)) {
                        meals.add(new ScheduledMeal(
                                offset, slot, MealStatus.COOKED, log.getPlanEntryId(), plansById.get(log.getPlanId()),
                                log.getDish(), 0, log.isLeftovers(), List.of()));
                        if (slot == MealSlot.DINNER && log.isLeftovers()) {
                            leftoverForTomorrow = log.getDish();
                        }
                    }
                    continue;
                }
                if (slot == MealSlot.LUNCH && pendingLeftover != null) {
                    meals.add(new ScheduledMeal(
                            offset, slot, MealStatus.LEFTOVERS, null, null, pendingLeftover, 0, false, List.of()));
                    pendingLeftover = null;
                    continue;
                }
                SlotQueue queue = queues.get(slot);
                if (queue == null) {
                    continue;
                }
                PlanEntry entry = queue.next();
                MealPlan plan = entry.getPlan();
                double portions = PortionCalculator.mealPortions(profile, plan, slot);
                boolean cooksLeftovers = PortionCalculator.cooksLeftovers(plan, slot);
                List<IngredientNeed> needs = allocate(
                        ingredientsByDish.getOrDefault(entry.getDish().getId(), List.of()),
                        PortionCalculator.ingredientFactor(entry.getDish(), portions),
                        pantryLeft,
                        listLeft);
                meals.add(new ScheduledMeal(
                        offset, slot, MealStatus.PLANNED, entry.getId(), plan, entry.getDish(), portions, cooksLeftovers, needs));
                if (cooksLeftovers) {
                    leftoverForTomorrow = entry.getDish();
                }
            }
            pendingLeftover = leftoverForTomorrow;
        }
        return new Schedule(today, days, meals, pantryLeft, listLeft);
    }

    /** Without an explicitly active plan the oldest plan with dishes is used, matching the previous behaviour. */
    @Transactional(readOnly = true)
    public List<MealPlan> activePlans() {
        List<MealPlan> plans = mealPlanRepository.findAllByCreatorIsNullOrderByCreatedAtAsc();
        List<MealPlan> active = plans.stream().filter(MealPlan::isActive).toList();
        if (!active.isEmpty()) {
            return active;
        }
        return plans.stream()
                .filter(plan -> planEntryRepository.countByPlanId(plan.getId()) > 0)
                .findFirst()
                .map(List::of)
                .orElse(List.of());
    }

    public static int shoppingWindowDays(ProfileDto profile) {
        int trips = Math.max(1, Math.min(7, profile.shoppingTripsPerWeek()));
        return (int) Math.ceil(7.0 / trips);
    }

    public static String key(String ingredientName, String unit) {
        return ingredientName.trim().toLowerCase(Locale.ROOT) + "|" + unit.trim().toLowerCase(Locale.ROOT);
    }

    private Map<MealSlot, SlotQueue> buildQueues(List<MealPlan> plans, List<PlanEntry> entries) {
        Map<MealSlot, SlotQueue> queues = new EnumMap<>(MealSlot.class);
        for (MealSlot slot : MealSlot.values()) {
            Map<Long, List<PlanEntry>> entriesByPlan = new LinkedHashMap<>();
            for (PlanEntry entry : entries) {
                if (entry.getMealSlot() == slot) {
                    entriesByPlan.computeIfAbsent(entry.getPlan().getId(), id -> new ArrayList<>()).add(entry);
                }
            }
            if (entriesByPlan.isEmpty()) {
                continue;
            }
            // The plan that waited longest in this slot goes first, then plans take turns.
            Map<Long, Instant> lastCooked = new HashMap<>();
            for (Long planId : entriesByPlan.keySet()) {
                cookLogRepository.findTopByPlanIdAndMealSlotOrderByCookedAtDesc(planId, slot)
                        .ifPresent(log -> lastCooked.put(planId, log.getCookedAt()));
            }
            List<Long> planOrder = plans.stream()
                    .map(MealPlan::getId)
                    .filter(entriesByPlan::containsKey)
                    .sorted(Comparator.comparing(
                            (Long planId) -> lastCooked.getOrDefault(planId, Instant.EPOCH)))
                    .toList();
            List<List<PlanEntry>> rotations = new ArrayList<>();
            for (Long planId : planOrder) {
                List<PlanEntry> planEntries = entriesByPlan.get(planId);
                List<PlanEntry> rotation = new ArrayList<>(planEntries.stream().filter(entry -> !entry.isCooked()).toList());
                rotation.addAll(planEntries.stream().filter(PlanEntry::isCooked).toList());
                rotations.add(rotation);
            }
            queues.put(slot, new SlotQueue(rotations));
        }
        return queues;
    }

    private static List<IngredientNeed> allocate(
            List<DishIngredient> ingredients, double factor, Map<String, Double> pantryLeft, Map<String, Double> listLeft) {
        List<IngredientNeed> needs = new ArrayList<>();
        for (DishIngredient ingredient : ingredients) {
            String name = ingredient.getIngredient().getName();
            String unit = ingredient.getIngredient().getUnit();
            String key = key(name, unit);
            double required = ingredient.getQuantityGrams() * factor;
            double fromPantry = Math.min(required, pantryLeft.getOrDefault(key, 0.0));
            pantryLeft.merge(key, -fromPantry, Double::sum);
            double missing = clamp(required - fromPantry);
            double fromList = Math.min(missing, listLeft.getOrDefault(key, 0.0));
            listLeft.merge(key, -fromList, Double::sum);
            needs.add(new IngredientNeed(name, unit, required, missing, clamp(missing - fromList)));
        }
        return needs;
    }

    private static double clamp(double value) {
        return value < EPSILON ? 0 : value;
    }

    private static ScheduledMealDto toDto(ScheduledMeal meal) {
        Dish dish = meal.dish();
        String ingredientStatus = null;
        if (meal.status() == MealStatus.PLANNED) {
            if (meal.needs().isEmpty()) {
                ingredientStatus = "UNKNOWN";
            } else if (meal.needs().stream().allMatch(need -> need.missing() == 0)) {
                ingredientStatus = "AVAILABLE";
            } else if (meal.needs().stream().allMatch(need -> need.uncovered() == 0)) {
                ingredientStatus = "ON_LIST";
            } else {
                ingredientStatus = "MISSING";
            }
        }
        return new ScheduledMealDto(
                meal.dayOffset(),
                meal.slot().name(),
                meal.status().name(),
                meal.planEntryId(),
                meal.plan() == null ? null : meal.plan().getId(),
                meal.plan() == null ? null : meal.plan().getName(),
                dish.getId(),
                dish.getName(),
                dish.getImageUrl(),
                dish.getPrepMinutes(),
                dish.getAdvancePrepNote(),
                meal.portions(),
                meal.cooksLeftovers(),
                ingredientStatus,
                meal.needs().stream()
                        .filter(need -> need.missing() > 0)
                        .map(need -> new MissingIngredientDto(
                                need.ingredientName(), need.unit(), need.missing(), need.uncovered()))
                        .toList());
    }

    private static final class SlotQueue {
        private final List<List<PlanEntry>> rotations;
        private final int[] positions;
        private int turn;

        SlotQueue(List<List<PlanEntry>> rotations) {
            this.rotations = rotations;
            this.positions = new int[rotations.size()];
        }

        PlanEntry next() {
            int planIndex = turn++ % rotations.size();
            List<PlanEntry> rotation = rotations.get(planIndex);
            return rotation.get(positions[planIndex]++ % rotation.size());
        }
    }
}
