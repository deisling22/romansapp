package de.roman.speiseplan.recommendation;

import de.roman.speiseplan.dish.Dish;
import de.roman.speiseplan.dish.DishRepository;
import de.roman.speiseplan.plan.CookLog;
import de.roman.speiseplan.plan.CookLogRepository;
import java.time.Duration;
import java.time.Instant;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/**
 * Taste signals that work without an account: tags picked in the onboarding, "less of this" feedback
 * and what the household actually cooked. Everything is scoped to the current household.
 */
@Service
public class TasteService {
    private static final double LIKED_WEIGHT = 8;
    private static final double COOKED_WEIGHT = 4;
    private static final double LESS_PENALTY = 3;
    private static final int COOK_HISTORY_DAYS = 90;
    private static final double COOK_HALF_LIFE_DAYS = 30;
    private static final int MAX_AVAILABLE_TAGS = 18;
    /** Labels that mark where a dish comes from, not what it tastes like. */
    private static final Set<String> NON_TASTE_TAGS = Set.of("romansplan", "beliebt", "neu");

    private final TastePreferenceRepository tastePreferenceRepository;
    private final DishFeedbackRepository dishFeedbackRepository;
    private final DishRepository dishRepository;
    private final CookLogRepository cookLogRepository;

    public TasteService(
            TastePreferenceRepository tastePreferenceRepository,
            DishFeedbackRepository dishFeedbackRepository,
            DishRepository dishRepository,
            CookLogRepository cookLogRepository) {
        this.tastePreferenceRepository = tastePreferenceRepository;
        this.dishFeedbackRepository = dishFeedbackRepository;
        this.dishRepository = dishRepository;
        this.cookLogRepository = cookLogRepository;
    }

    /**
     * Tag weights of the household. Cook history is only included on request because signed-in users
     * already contribute their cook events through the personal profile.
     */
    @Transactional(readOnly = true)
    public Map<String, Double> householdProfile(boolean includeCookHistory) {
        Map<String, Double> profile = new HashMap<>();
        for (TastePreference preference : tastePreferenceRepository.findAll()) {
            double weight = (preference.isLiked() ? LIKED_WEIGHT : 0) - preference.getPenalty();
            if (weight != 0) {
                profile.merge(preference.getTag(), weight, Double::sum);
            }
        }
        if (includeCookHistory) {
            Instant now = Instant.now();
            List<CookLog> logs = cookLogRepository.findByCookedAtGreaterThanEqualAndCookedAtLessThanOrderByCookedAtAsc(
                    now.minus(Duration.ofDays(COOK_HISTORY_DAYS)), now.plusSeconds(1));
            for (CookLog log : logs) {
                double days = Duration.between(log.getCookedAt(), now).toHours() / 24.0;
                double weight = COOKED_WEIGHT * Math.pow(0.5, days / COOK_HALF_LIFE_DAYS);
                for (String tag : ContentTagResolver.splitTags(log.getDish().getTags())) {
                    profile.merge(tag, weight, Double::sum);
                }
            }
        }
        return profile;
    }

    @Transactional(readOnly = true)
    public Set<Long> hiddenDishIds() {
        return dishFeedbackRepository.findAll().stream().map(DishFeedback::getDishId).collect(Collectors.toSet());
    }

    @Transactional(readOnly = true)
    public TasteDto getTaste() {
        Map<String, Long> frequency = dishRepository.findAll().stream()
                .flatMap(dish -> ContentTagResolver.splitTags(dish.getTags()).stream())
                .collect(Collectors.groupingBy(tag -> tag, Collectors.counting()));
        List<String> availableTags = frequency.entrySet().stream()
                // A tag carried by a single dish says nothing about taste
                .filter(entry -> entry.getValue() > 1 && !NON_TASTE_TAGS.contains(entry.getKey()))
                .sorted(Map.Entry.<String, Long>comparingByValue(Comparator.reverseOrder())
                        .thenComparing(Map.Entry.comparingByKey()))
                .limit(MAX_AVAILABLE_TAGS)
                .map(Map.Entry::getKey)
                .toList();
        List<String> likedTags = tastePreferenceRepository.findAll().stream()
                .filter(TastePreference::isLiked)
                .map(TastePreference::getTag)
                .sorted()
                .toList();
        return new TasteDto(availableTags, likedTags);
    }

    @Transactional
    public TasteDto setLikedTags(List<String> tags) {
        Set<String> liked = tags.stream()
                .map(tag -> tag.trim().toLowerCase())
                .filter(tag -> !tag.isEmpty())
                .collect(Collectors.toSet());
        Map<String, TastePreference> existing = tastePreferenceRepository.findAll().stream()
                .collect(Collectors.toMap(TastePreference::getTag, preference -> preference));
        existing.values().forEach(preference -> preference.setLiked(liked.contains(preference.getTag())));
        for (String tag : liked) {
            if (!existing.containsKey(tag)) {
                TastePreference preference = new TastePreference(tag);
                preference.setLiked(true);
                tastePreferenceRepository.save(preference);
            }
        }
        tastePreferenceRepository.flush();
        return getTaste();
    }

    /** Hides the dish from suggestions and lowers the weight of its tags. */
    @Transactional
    public void lessOf(Long dishId) {
        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Gericht wurde nicht gefunden."));
        if (dishFeedbackRepository.existsByDishId(dishId)) {
            return;
        }
        dishFeedbackRepository.save(new DishFeedback(dishId));
        Map<String, TastePreference> existing = tastePreferenceRepository.findAll().stream()
                .collect(Collectors.toMap(TastePreference::getTag, preference -> preference));
        for (String tag : ContentTagResolver.splitTags(dish.getTags())) {
            TastePreference preference = existing.get(tag);
            if (preference == null) {
                preference = tastePreferenceRepository.save(new TastePreference(tag));
            }
            preference.addPenalty(LESS_PENALTY);
        }
    }
}
