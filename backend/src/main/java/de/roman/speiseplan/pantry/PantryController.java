package de.roman.speiseplan.pantry;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pantry")
public class PantryController {
    private final PantryService pantryService;
    private final UseSoonService useSoonService;

    public PantryController(PantryService pantryService, UseSoonService useSoonService) {
        this.pantryService = pantryService;
        this.useSoonService = useSoonService;
    }

    @GetMapping
    public List<PantryItemDto> getItems() {
        return pantryService.getItems();
    }

    @PostMapping("/batches")
    @ResponseStatus(HttpStatus.CREATED)
    public List<PantryItemDto> addBatch(@Valid @RequestBody AddPantryBatchRequest request) {
        return pantryService.addBatch(request);
    }

    @PutMapping("/{itemId}/expiry")
    public PantryItemDto updateExpiry(@PathVariable Long itemId, @RequestBody UpdateExpiryRequest request) {
        return pantryService.updateExpiry(itemId, request.expiresOn());
    }

    @PutMapping("/{itemId}/quantity")
    public PantryItemDto updateQuantity(@PathVariable Long itemId, @Valid @RequestBody UpdateQuantityRequest request) {
        return pantryService.updateQuantity(itemId, request.quantity());
    }

    @GetMapping("/use-soon")
    public UseSoonDto useSoon(@AuthenticationPrincipal(errorOnInvalidType = false) OAuth2User user) {
        return useSoonService.useSoon(extractEmail(user));
    }

    /** {@code reason} (USED or WASTED) is recorded; without it the item is just corrected away. */
    @DeleteMapping("/{itemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteItem(@PathVariable Long itemId, @RequestParam(required = false) PantryRemoval.Reason reason) {
        pantryService.deleteItem(itemId, reason);
    }

    public record UpdateExpiryRequest(LocalDate expiresOn) {
    }

    public record UpdateQuantityRequest(@Positive double quantity) {
    }

    private static String extractEmail(OAuth2User user) {
        if (user == null) {
            return null;
        }
        Object email = user.getAttributes().get("email");
        return email == null ? user.getName() : email.toString();
    }
}
