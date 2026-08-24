package de.roman.speiseplan.dish;

import de.roman.speiseplan.recommendation.ContentType;
import de.roman.speiseplan.recommendation.TrendScoringService;
import de.roman.speiseplan.storage.LocalImageStorage;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class DishService {
    private final DishRepository dishRepository;
    private final DishIngredientRepository dishIngredientRepository;
    private final DishImageRepository dishImageRepository;
    private final PrepStepRepository prepStepRepository;
    private final IngredientRepository ingredientRepository;
    private final DishRatingRepository dishRatingRepository;
        private final DishFavoriteRepository dishFavoriteRepository;
    private final LocalImageStorage imageStorage;
    private final TrendScoringService trendScoringService;

    public DishService(
            DishRepository dishRepository,
            DishIngredientRepository dishIngredientRepository,
            DishImageRepository dishImageRepository,
            PrepStepRepository prepStepRepository,
            IngredientRepository ingredientRepository,
            DishRatingRepository dishRatingRepository,
            DishFavoriteRepository dishFavoriteRepository,
            LocalImageStorage imageStorage,
            TrendScoringService trendScoringService) {
        this.dishRepository = dishRepository;
        this.dishIngredientRepository = dishIngredientRepository;
        this.dishImageRepository = dishImageRepository;
        this.prepStepRepository = prepStepRepository;
        this.ingredientRepository = ingredientRepository;
        this.dishRatingRepository = dishRatingRepository;
        this.dishFavoriteRepository = dishFavoriteRepository;
        this.imageStorage = imageStorage;
        this.trendScoringService = trendScoringService;
    }

    @Transactional(readOnly = true)
        public List<DishCatalogEntryDto> searchDishes(String search, String tag, boolean favoritesOnly, String userEmail) {
        String normalizedSearch = blankToNull(search);
        String normalizedTag = blankToNull(tag);
        List<Dish> dishes = dishRepository.search(normalizedSearch, normalizedTag);
                if (favoritesOnly) {
                        if (userEmail == null) {
                                return List.of();
                        }
                        Set<Long> favoriteDishIds = dishFavoriteRepository.findByUserEmail(userEmail).stream()
                                        .map(favorite -> favorite.getDish().getId())
                                        .collect(Collectors.toSet());
                        dishes = dishes.stream().filter(dish -> favoriteDishIds.contains(dish.getId())).toList();
                }
        Map<Long, DishRatingRepository.DishRatingSummaryProjection> ratings =
                loadRatingSummaries(dishes.stream().map(Dish::getId).toList());
        return dishes.stream()
                .map(dish -> {
                    DishRatingRepository.DishRatingSummaryProjection summary = ratings.get(dish.getId());
                    return new DishCatalogEntryDto(
                            dish.getId(),
                            dish.getName(),
                            dish.getImageUrl(),
                            dish.getDescription(),
                            dish.getPrepMinutes(),
                            splitTags(dish.getTags()),
                            summary == null ? null : summary.getAverageRating(),
                            summary == null ? 0 : summary.getRatingCount().intValue());
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public DishDetailDto getDishDetail(Long dishId, String userEmail) {
        Dish dish = requireDish(dishId);
        trendScoringService.bump(ContentType.DISH, dishId, 1);
        List<DishIngredient> dishIngredients = dishIngredientRepository.findByDishId(dishId);
        List<DishImage> images = dishImageRepository.findByDishIdOrderBySortOrderAsc(dishId);
        List<PrepStep> steps = prepStepRepository.findByDishIdOrderByStepOrderAsc(dishId);
        DishRatingRepository.DishRatingSummaryProjection summary =
                loadRatingSummaries(List.of(dishId)).get(dishId);
        Integer myRating = userEmail == null
                ? null
                : dishRatingRepository
                        .findByDishIdAndUserEmail(dishId, userEmail)
                        .map(DishRating::getStars)
                        .orElse(null);

        return new DishDetailDto(
                dish.getId(),
                dish.getName(),
                dish.getImageUrl(),
                dish.getDescription(),
                dish.getPrepMinutes(),
                dish.getServings(),
                splitTags(dish.getTags()),
                DishNutritionCalculator.caloriesPerServing(dishIngredients, dish.getServings()),
                DishNutritionCalculator.proteinPerServing(dishIngredients, dish.getServings()),
                dish.getCarbsGrams(),
                dish.getFatGrams(),
                dish.getVitaminAMcg(),
                dish.getVitaminCMg(),
                dish.getVitaminDMcg(),
                images.stream().map(DishImage::getImageUrl).toList(),
                steps.stream()
                        .map(step -> new PrepStepDto(step.getId(), step.getStepOrder(), step.getText(), step.getTimerSeconds()))
                        .toList(),
                dishIngredients.stream()
                        .map(entry -> new DishIngredientDto(
                                entry.getId(),
                                entry.getIngredient().getName(),
                                entry.getQuantityGrams(),
                                entry.getIngredient().getUnit()))
                        .toList(),
                summary == null ? null : summary.getAverageRating(),
                summary == null ? 0 : summary.getRatingCount().intValue(),
                myRating,
                userEmail != null && dishFavoriteRepository.existsByDishIdAndUserEmail(dishId, userEmail));
    }

    @Transactional
    public NutritionDto updateNutrition(Long dishId, NutritionUpdateRequest request) {
        Dish dish = requireDish(dishId);
        dish.updateNutrition(
                request.carbsGrams(),
                request.fatGrams(),
                request.vitaminAMcg(),
                request.vitaminCMg(),
                request.vitaminDMcg());
        return new NutritionDto(
                dish.getCarbsGrams(), dish.getFatGrams(), dish.getVitaminAMcg(), dish.getVitaminCMg(), dish.getVitaminDMcg());
    }

    @Transactional
    public DishRatingResponseDto rateDish(Long dishId, String userEmail, int stars) {
        Dish dish = requireDish(dishId);
        DishRating rating = dishRatingRepository
                .findByDishIdAndUserEmail(dishId, userEmail)
                .orElseGet(() -> new DishRating(dish, userEmail, stars));
        rating.setStars(stars);
        dishRatingRepository.save(rating);
        trendScoringService.bump(ContentType.DISH, dishId, stars >= 4 ? 5 : stars == 3 ? 1 : -2);

        DishRatingRepository.DishRatingSummaryProjection summary =
                loadRatingSummaries(List.of(dishId)).get(dishId);
        return new DishRatingResponseDto(
                summary == null ? stars : summary.getAverageRating(),
                summary == null ? 1 : summary.getRatingCount().intValue(),
                stars);
    }

        @Transactional
        public DishFavoriteResponseDto setFavorite(Long dishId, String userEmail, boolean favorite) {
                if (userEmail == null || userEmail.isBlank()) {
                        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Anmeldung erforderlich.");
                }
                Dish dish = requireDish(dishId);
                boolean exists = dishFavoriteRepository.existsByDishIdAndUserEmail(dishId, userEmail);
                if (favorite && !exists) {
                        dishFavoriteRepository.save(new DishFavorite(dish, userEmail));
                        trendScoringService.bump(ContentType.DISH, dishId, 6);
                } else if (!favorite && exists) {
                        dishFavoriteRepository.deleteByDishIdAndUserEmail(dishId, userEmail);
                        trendScoringService.bump(ContentType.DISH, dishId, -3);
                }
                return new DishFavoriteResponseDto(favorite);
        }

    private Map<Long, DishRatingRepository.DishRatingSummaryProjection> loadRatingSummaries(List<Long> dishIds) {
        if (dishIds.isEmpty()) {
            return Map.of();
        }
        return dishRatingRepository.summarizeByDishIds(dishIds).stream()
                .collect(Collectors.toMap(DishRatingRepository.DishRatingSummaryProjection::getDishId, s -> s));
    }

    @Transactional
    public String addImage(Long dishId, MultipartFile image) {
        Dish dish = requireDish(dishId);
        String imageUrl = imageStorage.store(image);
        int nextSortOrder = (int) dishImageRepository.countByDishId(dishId);
        dishImageRepository.save(new DishImage(dish, imageUrl, nextSortOrder));
        return imageUrl;
    }

    @Transactional
    public PrepStepDto addStep(Long dishId, AddPrepStepRequest request) {
        Dish dish = requireDish(dishId);
        int nextStepOrder = (int) prepStepRepository.countByDishId(dishId);
        PrepStep step = prepStepRepository.save(
                new PrepStep(dish, nextStepOrder, request.text().trim(), request.timerSeconds()));
        return new PrepStepDto(step.getId(), step.getStepOrder(), step.getText(), step.getTimerSeconds());
    }

    @Transactional
    public DishIngredientDto addIngredient(Long dishId, AddDishIngredientRequest request) {
        Dish dish = requireDish(dishId);
        Ingredient ingredient = ingredientRepository.findById(request.ingredientId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Zutat wurde nicht gefunden."));
        DishIngredient dishIngredient = dishIngredientRepository.save(
                new DishIngredient(dish, ingredient, request.quantityGrams()));
        return new DishIngredientDto(
                dishIngredient.getId(), ingredient.getName(), dishIngredient.getQuantityGrams(), ingredient.getUnit());
    }

    private Dish requireDish(Long dishId) {
        return dishRepository.findById(dishId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Gericht wurde nicht gefunden."));
    }

    private static String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }

    private static List<String> splitTags(String tags) {
        if (tags == null || tags.isBlank()) {
            return List.of();
        }
        return Arrays.stream(tags.split(","))
                .map(String::trim)
                .filter(tag -> !tag.isEmpty())
                .toList();
    }
}
