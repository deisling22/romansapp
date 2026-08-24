package de.roman.speiseplan.recommendation;

import de.roman.speiseplan.creator.Creator;
import de.roman.speiseplan.creator.CreatorRepository;
import de.roman.speiseplan.creator.CreatorSubscriptionRepository;
import de.roman.speiseplan.creator.CreatorSummaryDto;
import de.roman.speiseplan.dish.Dish;
import de.roman.speiseplan.dish.DishCatalogEntryDto;
import de.roman.speiseplan.dish.DishFavorite;
import de.roman.speiseplan.dish.DishFavoriteRepository;
import de.roman.speiseplan.dish.DishRating;
import de.roman.speiseplan.dish.DishRatingRepository;
import de.roman.speiseplan.dish.DishRatingRepository.DishRatingSummaryProjection;
import de.roman.speiseplan.dish.DishRepository;
import de.roman.speiseplan.gamification.GamificationEvent;
import de.roman.speiseplan.gamification.GamificationEventRepository;
import de.roman.speiseplan.gamification.GamificationEventType;
import de.roman.speiseplan.plan.MealPlan;
import de.roman.speiseplan.plan.MealPlanRepository;
import de.roman.speiseplan.plan.PlanEntry;
import de.roman.speiseplan.plan.PlanEntryRepository;
import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Builds a "for you" feed similar to Instagram/TikTok's ranking: a blend of
 * <ul>
 *   <li>personal taste (content-based, derived from the user's own cooks/ratings/favorites), and</li>
 *   <li>cross-user virality (a decayed engagement score shared by all users, see {@link TrendScoringService}),</li>
 * </ul>
 * plus small boosts for new content and a touch of randomness so the feed does not feel static.
 * Anonymous users simply fall back to "what's currently trending".
 */
@Service
public class RecommendationService {
    private static final double TASTE_HALF_LIFE_HOURS = 24 * 30;
    private static final int DISH_LIMIT = 12;
    private static final int CREATOR_LIMIT = 6;
    private static final int PLAN_LIMIT = 6;

    private final DishRepository dishRepository;
    private final DishRatingRepository dishRatingRepository;
    private final DishFavoriteRepository dishFavoriteRepository;
    private final CreatorRepository creatorRepository;
    private final CreatorSubscriptionRepository creatorSubscriptionRepository;
    private final MealPlanRepository mealPlanRepository;
    private final PlanEntryRepository planEntryRepository;
    private final GamificationEventRepository gamificationEventRepository;
    private final TrendScoringService trendScoringService;
    private final ContentTagResolver tagResolver;

    public RecommendationService(
            DishRepository dishRepository,
            DishRatingRepository dishRatingRepository,
            DishFavoriteRepository dishFavoriteRepository,
            CreatorRepository creatorRepository,
            CreatorSubscriptionRepository creatorSubscriptionRepository,
            MealPlanRepository mealPlanRepository,
            PlanEntryRepository planEntryRepository,
            GamificationEventRepository gamificationEventRepository,
            TrendScoringService trendScoringService,
            ContentTagResolver tagResolver) {
        this.dishRepository = dishRepository;
        this.dishRatingRepository = dishRatingRepository;
        this.dishFavoriteRepository = dishFavoriteRepository;
        this.creatorRepository = creatorRepository;
        this.creatorSubscriptionRepository = creatorSubscriptionRepository;
        this.mealPlanRepository = mealPlanRepository;
        this.planEntryRepository = planEntryRepository;
        this.gamificationEventRepository = gamificationEventRepository;
        this.trendScoringService = trendScoringService;
        this.tagResolver = tagResolver;
    }

    @Transactional(readOnly = true)
    public RecommendationsDto getRecommendations(String ownerEmail) {
        Map<String, Double> tasteProfile = ownerEmail == null ? Map.of() : buildTasteProfile(ownerEmail);
        return new RecommendationsDto(
                recommendDishes(ownerEmail, tasteProfile),
                recommendCreators(ownerEmail, tasteProfile),
                recommendPlans(tasteProfile));
    }

    // --- personal taste profile, built from the user's own authoritative actions -----------------

    private Map<String, Double> buildTasteProfile(String ownerEmail) {
        Map<String, Double> profile = new HashMap<>();
        Instant now = Instant.now();

        List<GamificationEvent> events = gamificationEventRepository.findByOwnerEmailOrderByOccurredAtAsc(ownerEmail);
        List<DishFavorite> favorites = dishFavoriteRepository.findByUserEmail(ownerEmail);
        List<DishRating> ratings = dishRatingRepository.findByUserEmail(ownerEmail);

        Set<Long> dishIds = new HashSet<>();
        for (GamificationEvent event : events) {
            Long dishId = parseDishId(event.getReferenceId());
            if (dishId != null && weightFor(event.getEventType()) != 0) {
                dishIds.add(dishId);
            }
        }
        favorites.forEach(favorite -> dishIds.add(favorite.getDish().getId()));
        ratings.forEach(rating -> dishIds.add(rating.getDish().getId()));

        Map<Long, Dish> dishesById = dishRepository.findAllById(dishIds).stream()
                .collect(Collectors.toMap(Dish::getId, dish -> dish));

        for (GamificationEvent event : events) {
            Long dishId = parseDishId(event.getReferenceId());
            Dish dish = dishId == null ? null : dishesById.get(dishId);
            double weight = weightFor(event.getEventType());
            if (dish == null || weight == 0) {
                continue;
            }
            applyDecayedWeight(profile, dish, weight, event.getOccurredAt(), now);
        }
        for (DishFavorite favorite : favorites) {
            applyDecayedWeight(profile, favorite.getDish(), 6, favorite.getCreatedAt(), now);
        }
        for (DishRating rating : ratings) {
            double weight = rating.getStars() >= 4 ? 5 : rating.getStars() == 3 ? 1 : -4;
            applyDecayedWeight(profile, rating.getDish(), weight, rating.getUpdatedAt(), now);
        }
        return profile;
    }

    private static void applyDecayedWeight(
            Map<String, Double> profile, Dish dish, double weight, Instant occurredAt, Instant now) {
        double decayed = weight * decayFactor(occurredAt, now);
        for (String tag : ContentTagResolver.splitTags(dish.getTags())) {
            profile.merge(tag, decayed, Double::sum);
        }
    }

    private static double decayFactor(Instant occurredAt, Instant now) {
        double hours = Duration.between(occurredAt, now).toMillis() / 3_600_000.0;
        return hours <= 0 ? 1 : Math.pow(0.5, hours / TASTE_HALF_LIFE_HOURS);
    }

    private static double weightFor(GamificationEventType type) {
        return switch (type) {
            case COOK_DISH -> 4;
            case TRY_NEW_DISH -> 2;
            case CREATOR_RECIPE_COOKED -> 3;
            default -> 0;
        };
    }

    private static Long parseDishId(String referenceId) {
        if (referenceId == null) {
            return null;
        }
        try {
            return Long.valueOf(referenceId);
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private static double personalScore(Map<String, Double> tasteProfile, List<String> tags) {
        double score = 0;
        for (String tag : tags) {
            score += tasteProfile.getOrDefault(tag, 0.0);
        }
        return score;
    }

    // --- dishes -------------------------------------------------------------------------------

    private List<DishCatalogEntryDto> recommendDishes(String ownerEmail, Map<String, Double> tasteProfile) {
        List<Dish> dishes = dishRepository.findAll();
        if (dishes.isEmpty()) {
            return List.of();
        }
        List<Long> dishIds = dishes.stream().map(Dish::getId).toList();
        Map<Long, Double> trend = trendScoringService.currentScores(ContentType.DISH, dishIds);
        Map<Long, DishRatingSummaryProjection> ratingSummaries = dishRatingRepository.summarizeByDishIds(dishIds)
                .stream()
                .collect(Collectors.toMap(DishRatingSummaryProjection::getDishId, summary -> summary));

        Set<Long> dislikedDishIds = new HashSet<>();
        Set<Long> engagedDishIds = new HashSet<>();
        if (ownerEmail != null) {
            dishFavoriteRepository.findByUserEmail(ownerEmail)
                    .forEach(favorite -> engagedDishIds.add(favorite.getDish().getId()));
            dishRatingRepository.findByUserEmail(ownerEmail).forEach(rating -> {
                if (rating.getStars() <= 2) {
                    dislikedDishIds.add(rating.getDish().getId());
                } else {
                    engagedDishIds.add(rating.getDish().getId());
                }
            });
        }

        Instant now = Instant.now();
        return dishes.stream()
                .map(dish -> {
                    List<String> tags = ContentTagResolver.splitTags(dish.getTags());
                    DishRatingSummaryProjection summary = ratingSummaries.get(dish.getId());
                    double averageRating = summary == null ? 2.5 : summary.getAverageRating();
                    double personal = personalScore(tasteProfile, tags);
                    double trendScore = trend.getOrDefault(dish.getId(), 0.0);
                    boolean isNew = Duration.between(dish.getCreatedAt(), now).toDays() <= 7;
                    double score = personal * 1.4 + trendScore + averageRating * 0.6 + (isNew ? 3 : 0);
                    if (dislikedDishIds.contains(dish.getId())) {
                        score *= 0.1;
                    } else if (engagedDishIds.contains(dish.getId())) {
                        score *= 0.55;
                    }
                    score += Math.random() * 1.5;
                    return new ScoredDish(dish, score, summary);
                })
                .sorted((a, b) -> Double.compare(b.score, a.score))
                .limit(DISH_LIMIT)
                .map(scored -> new DishCatalogEntryDto(
                        scored.dish.getId(),
                        scored.dish.getName(),
                        scored.dish.getImageUrl(),
                        scored.dish.getDescription(),
                        scored.dish.getPrepMinutes(),
                        ContentTagResolver.splitTags(scored.dish.getTags()),
                        scored.summary == null ? null : scored.summary.getAverageRating(),
                        scored.summary == null ? 0 : scored.summary.getRatingCount().intValue()))
                .toList();
    }

    private record ScoredDish(Dish dish, double score, DishRatingSummaryProjection summary) {
    }

    // --- creators -------------------------------------------------------------------------------

    private List<CreatorSummaryDto> recommendCreators(String ownerEmail, Map<String, Double> tasteProfile) {
        Set<Long> subscribed = ownerEmail == null
                ? Set.of()
                : creatorSubscriptionRepository.findByOwnerEmail(ownerEmail).stream()
                        .map(subscription -> subscription.getCreator().getId())
                        .collect(Collectors.toSet());
        List<Creator> candidates = creatorRepository.findAll().stream()
                .filter(creator -> !subscribed.contains(creator.getId()))
                .toList();
        if (candidates.isEmpty()) {
            return List.of();
        }
        List<Long> ids = candidates.stream().map(Creator::getId).toList();
        Map<Long, Double> trend = trendScoringService.currentScores(ContentType.CREATOR, ids);

        return candidates.stream()
                .map(creator -> {
                    int planCount = mealPlanRepository.findByCreatorIdOrderByCreatedAtAsc(creator.getId()).size();
                    double personal = personalScore(tasteProfile, tagResolver.creatorTags(creator.getId()));
                    double trendScore = trend.getOrDefault(creator.getId(), 0.0);
                    double score = personal * 1.2 + trendScore + planCount * 0.4 + Math.random() * 1.2;
                    return new ScoredCreator(creator, score, planCount);
                })
                .sorted((a, b) -> Double.compare(b.score, a.score))
                .limit(CREATOR_LIMIT)
                .map(scored -> new CreatorSummaryDto(
                        scored.creator.getId(),
                        scored.creator.getName(),
                        scored.creator.getHandle(),
                        scored.creator.getBio(),
                        scored.creator.getAvatarUrl(),
                        scored.creator.getReelImageUrl(),
                        scored.creator.getReelVideoUrl(),
                        scored.planCount))
                .toList();
    }

    private record ScoredCreator(Creator creator, double score, int planCount) {
    }

    // --- creator plans --------------------------------------------------------------------------

    private List<PlanRecommendationDto> recommendPlans(Map<String, Double> tasteProfile) {
        List<MealPlan> plans = mealPlanRepository.findAllByCreatorIsNotNullOrderByCreatedAtAsc();
        if (plans.isEmpty()) {
            return List.of();
        }
        List<Long> ids = plans.stream().map(MealPlan::getId).toList();
        Map<Long, Double> trend = trendScoringService.currentScores(ContentType.PLAN, ids);

        return plans.stream()
                .map(plan -> {
                    List<PlanEntry> entries = planEntryRepository.findByPlanIdOrderBySortOrderAsc(plan.getId());
                    double personal = personalScore(tasteProfile, tagResolver.planTags(plan.getId()));
                    double trendScore = trend.getOrDefault(plan.getId(), 0.0);
                    double score = personal * 1.3 + trendScore + Math.random() * 1.2;
                    String coverImageUrl = entries.isEmpty() ? "" : entries.getFirst().getDish().getImageUrl();
                    return new ScoredPlan(plan, score, entries.size(), coverImageUrl);
                })
                .sorted((a, b) -> Double.compare(b.score, a.score))
                .limit(PLAN_LIMIT)
                .map(scored -> new PlanRecommendationDto(
                        scored.plan.getId(),
                        scored.plan.getName(),
                        scored.plan.getCreator().getId(),
                        scored.plan.getCreator().getName(),
                        scored.plan.getCreator().getHandle(),
                        scored.dishCount,
                        scored.coverImageUrl))
                .toList();
    }

    private record ScoredPlan(MealPlan plan, double score, int dishCount, String coverImageUrl) {
    }
}
