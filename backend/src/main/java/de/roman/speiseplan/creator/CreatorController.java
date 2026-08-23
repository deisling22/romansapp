package de.roman.speiseplan.creator;

import de.roman.speiseplan.dish.DishDto;
import de.roman.speiseplan.plan.PlanSummaryDto;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/creators")
public class CreatorController {
    private final CreatorService creatorService;

    public CreatorController(CreatorService creatorService) {
        this.creatorService = creatorService;
    }

    @GetMapping
    public List<CreatorSummaryDto> getCreators() {
        return creatorService.getCreators();
    }

    @GetMapping("/{creatorId}")
    public CreatorDetailDto getCreator(@PathVariable Long creatorId) {
        return creatorService.getCreator(creatorId);
    }

    @GetMapping("/{creatorId}/plans/{planId}/dishes")
    public List<DishDto> getPlanDishes(@PathVariable Long creatorId, @PathVariable Long planId) {
        return creatorService.getPlanDishes(creatorId, planId);
    }

    @PostMapping("/{creatorId}/plans/{planId}/copy")
    @ResponseStatus(HttpStatus.CREATED)
    public PlanSummaryDto copyPlan(@PathVariable Long creatorId, @PathVariable Long planId) {
        return creatorService.copyPlan(creatorId, planId);
    }
}