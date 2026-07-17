package de.roman.speiseplan.plan;

import de.roman.speiseplan.dish.DishDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/plans")
public class MealPlanController {
    private final MealPlanService mealPlanService;

    public MealPlanController(MealPlanService mealPlanService) {
        this.mealPlanService = mealPlanService;
    }

    @GetMapping
    public List<PlanSummaryDto> getPlans() {
        return mealPlanService.getPlans();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PlanSummaryDto createPlan(@Valid @RequestBody CreatePlanRequest request) {
        return mealPlanService.createPlan(request.name());
    }

    @DeleteMapping("/{planId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePlan(@PathVariable Long planId) {
        mealPlanService.deletePlan(planId);
    }

    @PostMapping("/{planId}/copy")
    @ResponseStatus(HttpStatus.CREATED)
    public PlanSummaryDto copyPlan(@PathVariable Long planId) {
        return mealPlanService.copyPlan(planId);
    }

    @GetMapping("/{planId}/dishes")
    public List<DishDto> getDishes(@PathVariable Long planId) {
        return mealPlanService.getDishes(planId);
    }

    @PostMapping(path = "/{planId}/dishes", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public DishDto addDish(
            @PathVariable Long planId,
            @RequestParam @NotBlank @Size(max = 120) String name,
            @RequestParam MultipartFile image) {
        return mealPlanService.addDish(planId, name, image);
    }
}