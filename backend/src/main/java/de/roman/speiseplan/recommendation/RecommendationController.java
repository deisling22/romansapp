package de.roman.speiseplan.recommendation;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {
    private final RecommendationService recommendationService;
    private final TasteService tasteService;

    public RecommendationController(RecommendationService recommendationService, TasteService tasteService) {
        this.recommendationService = recommendationService;
        this.tasteService = tasteService;
    }

    @PostMapping("/dishes/{dishId}/less")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void lessOf(@PathVariable Long dishId) {
        tasteService.lessOf(dishId);
    }

    @GetMapping
    public RecommendationsDto getRecommendations(@AuthenticationPrincipal(errorOnInvalidType = false) OAuth2User user) {
        return recommendationService.getRecommendations(extractEmail(user));
    }

    private static String extractEmail(OAuth2User user) {
        if (user == null) {
            return null;
        }
        Object email = user.getAttributes().get("email");
        return email == null ? user.getName() : email.toString();
    }
}
