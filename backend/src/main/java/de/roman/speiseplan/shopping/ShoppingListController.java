package de.roman.speiseplan.shopping;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ShoppingListController {
    private final ShoppingListService shoppingListService;

    public ShoppingListController(ShoppingListService shoppingListService) {
        this.shoppingListService = shoppingListService;
    }

    @GetMapping("/api/plans/{planId}/shopping-list")
    public List<ShoppingListItemDto> getItems(@PathVariable Long planId) {
        return shoppingListService.getItems(planId);
    }

    @PostMapping("/api/plans/{planId}/shopping-list/generate")
    public List<ShoppingListItemDto> generate(@PathVariable Long planId) {
        return shoppingListService.generate(planId);
    }

    @PatchMapping("/api/shopping-list/{itemId}")
    public ShoppingListItemDto updateItem(
            @PathVariable Long itemId, @Valid @RequestBody UpdateShoppingListItemRequest request) {
        return shoppingListService.updateItem(itemId, request.checked());
    }
}
