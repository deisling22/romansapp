package de.roman.speiseplan.dish;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/dishes")
public class DishController {
    private final DishService dishService;

    public DishController(DishService dishService) {
        this.dishService = dishService;
    }

    @GetMapping
    public List<DishCatalogEntryDto> search(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String tag) {
        return dishService.searchDishes(search, tag);
    }

    @GetMapping("/{dishId}")
    public DishDetailDto getDish(
            @PathVariable Long dishId, @AuthenticationPrincipal(errorOnInvalidType = false) OAuth2User user) {
        return dishService.getDishDetail(dishId, extractEmail(user));
    }

    @PostMapping("/{dishId}/ratings")
    public DishRatingResponseDto rateDish(
            @PathVariable Long dishId,
            @Valid @RequestBody RateDishRequest request,
            @AuthenticationPrincipal(errorOnInvalidType = false) OAuth2User user) {
        return dishService.rateDish(dishId, extractEmail(user), request.stars());
    }

    private static String extractEmail(OAuth2User user) {
        if (user == null) {
            return null;
        }
        Object email = user.getAttributes().get("email");
        return email == null ? user.getName() : email.toString();
    }

    @PostMapping(path = "/{dishId}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ImageResponse addImage(@PathVariable Long dishId, @RequestParam MultipartFile image) {
        return new ImageResponse(dishService.addImage(dishId, image));
    }

    @PostMapping("/{dishId}/steps")
    @ResponseStatus(HttpStatus.CREATED)
    public PrepStepDto addStep(@PathVariable Long dishId, @Valid @RequestBody AddPrepStepRequest request) {
        return dishService.addStep(dishId, request);
    }

    @PostMapping("/{dishId}/ingredients")
    @ResponseStatus(HttpStatus.CREATED)
    public DishIngredientDto addIngredient(
            @PathVariable Long dishId, @Valid @RequestBody AddDishIngredientRequest request) {
        return dishService.addIngredient(dishId, request);
    }

    public record ImageResponse(String imageUrl) {
    }
}
