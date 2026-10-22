package de.roman.speiseplan.schedule;

import de.roman.speiseplan.dish.Dish;
import de.roman.speiseplan.dish.DishIngredientRepository;
import de.roman.speiseplan.pantry.PantryService;
import de.roman.speiseplan.plan.CookLog;
import de.roman.speiseplan.plan.CookLogRepository;
import de.roman.speiseplan.plan.MealPlan;
import de.roman.speiseplan.plan.PlanEntry;
import de.roman.speiseplan.plan.PlanEntryRepository;
import de.roman.speiseplan.plan.PortionCalculator;
import de.roman.speiseplan.profile.ProfileService;
import de.roman.speiseplan.recommendation.ContentType;
import de.roman.speiseplan.recommendation.TrendScoringService;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CookingService {
    private final PlanEntryRepository planEntryRepository;
    private final CookLogRepository cookLogRepository;
    private final DishIngredientRepository dishIngredientRepository;
    private final PantryService pantryService;
    private final ProfileService profileService;
    private final TrendScoringService trendScoringService;

    public CookingService(
            PlanEntryRepository planEntryRepository,
            CookLogRepository cookLogRepository,
            DishIngredientRepository dishIngredientRepository,
            PantryService pantryService,
            ProfileService profileService,
            TrendScoringService trendScoringService) {
        this.planEntryRepository = planEntryRepository;
        this.cookLogRepository = cookLogRepository;
        this.dishIngredientRepository = dishIngredientRepository;
        this.pantryService = pantryService;
        this.profileService = profileService;
        this.trendScoringService = trendScoringService;
    }

    @Transactional
    public void markCooked(Long planEntryId) {
        PlanEntry entry = planEntryRepository.findById(planEntryId)
                .filter(candidate -> candidate.getPlan().getCreator() == null)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan-Eintrag wurde nicht gefunden."));
        MealPlan plan = entry.getPlan();
        if (entry.isCooked()) {
            if (cookedToday(entry.getCookedAt())) {
                return;
            }
            List<PlanEntry> slotEntries = planEntryRepository.findByPlanIdAndMealSlot(plan.getId(), entry.getMealSlot());
            // A cooked entry is only offered again once the whole slot is done, so this starts the next round.
            if (slotEntries.stream().allMatch(PlanEntry::isCooked)) {
                slotEntries.forEach(PlanEntry::resetCooked);
            }
        }

        Dish dish = entry.getDish();
        double portions = PortionCalculator.mealPortions(profileService.getProfile(), plan, entry.getMealSlot());
        pantryService.consume(
                dishIngredientRepository.findByDishId(dish.getId()), PortionCalculator.ingredientFactor(dish, portions));
        Instant now = Instant.now();
        entry.markCooked(now);
        cookLogRepository.save(new CookLog(entry, PortionCalculator.cooksLeftovers(plan, entry.getMealSlot()), now));
        trendScoringService.bump(ContentType.DISH, dish.getId(), 4);
    }

    private static boolean cookedToday(Instant cookedAt) {
        if (cookedAt == null) {
            return false;
        }
        ZoneId zone = ZoneId.systemDefault();
        return LocalDate.ofInstant(cookedAt, zone).equals(LocalDate.now(zone));
    }
}
