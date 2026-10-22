package de.roman.speiseplan.recipeimport;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recipe-import")
public class RecipeImportController {
    private final RecipeImportService recipeImportService;

    public RecipeImportController(RecipeImportService recipeImportService) {
        this.recipeImportService = recipeImportService;
    }

    @PostMapping
    public RecipeImportDto importRecipe(@Valid @RequestBody ImportRequest request) {
        return recipeImportService.importFrom(request.url());
    }

    @PostMapping("/image")
    public ResponseEntity<byte[]> importImage(@Valid @RequestBody ImportRequest request) {
        RecipeImportService.FetchedImage image = recipeImportService.fetchImage(request.url());
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(image.contentType()))
                .header("X-Content-Type-Options", "nosniff")
                .body(image.body());
    }

    public record ImportRequest(@NotBlank @Size(max = 2000) String url) {
    }
}
