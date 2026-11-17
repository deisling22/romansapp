package de.roman.speiseplan.schedule;

import de.roman.speiseplan.schedule.DishActionDtos.CookDishRequest;
import de.roman.speiseplan.schedule.DishActionDtos.CookedDto;
import de.roman.speiseplan.schedule.DishActionDtos.DishAvailabilityDto;
import de.roman.speiseplan.shopping.ShoppingListItemDto;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DishActionController {
    private final DishActionService dishActionService;

    public DishActionController(DishActionService dishActionService) {
        this.dishActionService = dishActionService;
    }

    @GetMapping("/api/dishes/{dishId}/availability")
    public DishAvailabilityDto availability(@PathVariable Long dishId, @RequestParam(required = false) Double servings) {
        return dishActionService.availability(dishId, servings);
    }

    @PostMapping("/api/dishes/{dishId}/missing-to-shopping-list")
    public List<ShoppingListItemDto> addMissingToShoppingList(
            @PathVariable Long dishId, @RequestParam(required = false) Double servings) {
        return dishActionService.addMissingToShoppingList(dishId, servings);
    }

    @PostMapping("/api/dishes/{dishId}/cook")
    public CookedDto cook(@PathVariable Long dishId, @Valid @RequestBody(required = false) CookDishRequest request) {
        return dishActionService.cook(dishId, request);
    }
}
