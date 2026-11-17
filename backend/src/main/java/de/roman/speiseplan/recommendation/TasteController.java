package de.roman.speiseplan.recommendation;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/taste")
public class TasteController {
    private final TasteService tasteService;

    public TasteController(TasteService tasteService) {
        this.tasteService = tasteService;
    }

    @GetMapping
    public TasteDto getTaste() {
        return tasteService.getTaste();
    }

    @PutMapping
    public TasteDto setLikedTags(@Valid @RequestBody TasteDto.UpdateRequest request) {
        return tasteService.setLikedTags(request.likedTags());
    }
}
