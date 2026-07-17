package de.roman.speiseplan.dish;

import de.roman.speiseplan.storage.LocalImageStorage;
import java.util.Arrays;
import java.util.List;
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
    private final LocalImageStorage imageStorage;

    public DishService(
            DishRepository dishRepository,
            DishIngredientRepository dishIngredientRepository,
            DishImageRepository dishImageRepository,
            PrepStepRepository prepStepRepository,
            IngredientRepository ingredientRepository,
            LocalImageStorage imageStorage) {
        this.dishRepository = dishRepository;
        this.dishIngredientRepository = dishIngredientRepository;
        this.dishImageRepository = dishImageRepository;
        this.prepStepRepository = prepStepRepository;
        this.ingredientRepository = ingredientRepository;
        this.imageStorage = imageStorage;
    }

    @Transactional(readOnly = true)
    public List<DishCatalogEntryDto> searchDishes(String search, String tag) {
        String normalizedSearch = blankToNull(search);
        String normalizedTag = blankToNull(tag);
        return dishRepository.search(normalizedSearch, normalizedTag).stream()
                .map(dish -> new DishCatalogEntryDto(
                        dish.getId(),
                        dish.getName(),
                        dish.getImageUrl(),
                        dish.getDescription(),
                        dish.getPrepMinutes(),
                        splitTags(dish.getTags())))
                .toList();
    }

    @Transactional(readOnly = true)
    public DishDetailDto getDishDetail(Long dishId) {
        Dish dish = requireDish(dishId);
        List<DishIngredient> dishIngredients = dishIngredientRepository.findByDishId(dishId);
        List<DishImage> images = dishImageRepository.findByDishIdOrderBySortOrderAsc(dishId);
        List<PrepStep> steps = prepStepRepository.findByDishIdOrderByStepOrderAsc(dishId);

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
                        .toList());
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
