package de.roman.speiseplan.dish;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ingredients")
public class IngredientController {
    private final IngredientRepository ingredientRepository;

    public IngredientController(IngredientRepository ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }

    @GetMapping
    public List<IngredientDto> getIngredients() {
        return ingredientRepository.findAll().stream().map(IngredientDto::from).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IngredientDto createIngredient(@Valid @RequestBody CreateIngredientRequest request) {
        Ingredient ingredient = ingredientRepository.save(
                new Ingredient(request.name().trim(), request.kcalPer100(), request.proteinPer100(), request.unit().trim()));
        return IngredientDto.from(ingredient);
    }
}
