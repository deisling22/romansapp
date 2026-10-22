package de.roman.speiseplan.shopping;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/staples")
public class StapleController {
    private final StapleItemRepository stapleItemRepository;

    public StapleController(StapleItemRepository stapleItemRepository) {
        this.stapleItemRepository = stapleItemRepository;
    }

    public record StapleItemDto(Long id, String ingredientName, double quantity, String unit) {
        static StapleItemDto from(StapleItem item) {
            return new StapleItemDto(item.getId(), item.getIngredientName(), item.getQuantity(), item.getUnit());
        }
    }

    @GetMapping
    public List<StapleItemDto> getStaples() {
        return stapleItemRepository.findAllByOrderByIngredientNameAsc().stream().map(StapleItemDto::from).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StapleItemDto addStaple(@Valid @RequestBody CreateShoppingListItemRequest request) {
        return StapleItemDto.from(stapleItemRepository.save(new StapleItem(
                request.ingredientName().trim(), request.quantity(), request.unit().trim())));
    }

    @DeleteMapping("/{stapleId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void deleteStaple(@PathVariable Long stapleId) {
        if (!stapleItemRepository.existsById(stapleId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Grundbedarf wurde nicht gefunden.");
        }
        stapleItemRepository.deleteById(stapleId);
    }
}
