package de.roman.speiseplan.gamification;

import de.roman.speiseplan.gamification.GamificationDtos.EventBatchRequest;
import de.roman.speiseplan.gamification.GamificationDtos.ProgressDto;
import de.roman.speiseplan.gamification.GamificationDtos.SettingsRequest;
import jakarta.validation.Valid;
import java.security.Principal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/gamification")
public class GamificationController {
    private final GamificationService service;

    public GamificationController(GamificationService service) {
        this.service = service;
    }

    @GetMapping
    public ProgressDto progress(Principal principal) {
        return service.progress(principal.getName());
    }

    @PostMapping("/events")
    public ProgressDto record(Principal principal, @Valid @RequestBody EventBatchRequest request) {
        return service.record(principal.getName(), request.events());
    }

    @PutMapping("/settings")
    public ProgressDto updateSettings(Principal principal, @Valid @RequestBody SettingsRequest request) {
        return service.updateSettings(principal.getName(), request);
    }
}