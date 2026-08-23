package de.roman.speiseplan.shopping;

import de.roman.speiseplan.pantry.PantryItemDto;
import de.roman.speiseplan.pantry.PantryService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ResponseStatus;

@RestController
public class ShoppingListController {
    private final ShoppingListService shoppingListService;
    private final PantryService pantryService;

    public ShoppingListController(ShoppingListService shoppingListService, PantryService pantryService) {
        this.shoppingListService = shoppingListService;
        this.pantryService = pantryService;
    }

    @GetMapping("/api/shopping-list")
    public List<ShoppingListItemDto> getAllItems() {
        return shoppingListService.getAllItems();
    }

    @PostMapping("/api/shopping-list")
    @ResponseStatus(HttpStatus.CREATED)
    public ShoppingListItemDto addItem(@Valid @RequestBody CreateShoppingListItemRequest request) {
        return shoppingListService.addItem(request);
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

    @DeleteMapping("/api/shopping-list/{itemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteItem(@PathVariable Long itemId) {
        shoppingListService.deleteItem(itemId);
    }

    @PostMapping("/api/shopping-list/checkout")
    public List<PantryItemDto> checkout() {
        return pantryService.checkoutCheckedItems();
    }
}
