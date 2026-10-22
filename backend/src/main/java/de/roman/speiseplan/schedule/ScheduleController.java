package de.roman.speiseplan.schedule;

import de.roman.speiseplan.schedule.ScheduleDtos.MealSlotRequest;
import de.roman.speiseplan.schedule.ScheduleDtos.ReplaceDishRequest;
import de.roman.speiseplan.schedule.ScheduleDtos.ReplacementSuggestionDto;
import de.roman.speiseplan.schedule.ScheduleDtos.ScheduleDto;
import de.roman.speiseplan.schedule.ScheduleDtos.SwapEntryRequest;
import de.roman.speiseplan.shopping.ShoppingListItemDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ScheduleController {
    private final ScheduleService scheduleService;
    private final PlanEntryActionService actionService;

    public ScheduleController(ScheduleService scheduleService, PlanEntryActionService actionService) {
        this.scheduleService = scheduleService;
        this.actionService = actionService;
    }

    @GetMapping("/api/schedule")
    public ScheduleDto getSchedule(
            @RequestParam(defaultValue = "7") @Min(1) @Max(ScheduleService.MAX_DAYS) int days) {
        return scheduleService.getSchedule(days);
    }

    @PostMapping("/api/schedule/shopping-list")
    public List<ShoppingListItemDto> generateUpcomingShoppingList(
            @RequestParam(required = false) @Min(1) @Max(ScheduleService.MAX_DAYS) Integer days) {
        return actionService.generateUpcomingShoppingList(days);
    }

    @PostMapping("/api/plan-entries/{entryId}/swap")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void swap(@PathVariable Long entryId, @Valid @RequestBody SwapEntryRequest request) {
        actionService.swap(entryId, request.otherEntryId());
    }

    @PostMapping("/api/plan-entries/{entryId}/skip")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void skip(@PathVariable Long entryId) {
        actionService.skip(entryId);
    }

    @PutMapping("/api/plan-entries/{entryId}/dish")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void replaceDish(@PathVariable Long entryId, @Valid @RequestBody ReplaceDishRequest request) {
        actionService.replaceDish(entryId, request.dishId());
    }

    @PutMapping("/api/plan-entries/{entryId}/meal-slot")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void setMealSlot(@PathVariable Long entryId, @Valid @RequestBody MealSlotRequest request) {
        actionService.setMealSlot(entryId, request.mealSlot());
    }

    @GetMapping("/api/plan-entries/{entryId}/replacement-suggestions")
    public List<ReplacementSuggestionDto> replacementSuggestions(@PathVariable Long entryId) {
        return actionService.replacementSuggestions(entryId);
    }

    @PostMapping("/api/plan-entries/{entryId}/missing-to-shopping-list")
    public List<ShoppingListItemDto> addMissingToShoppingList(@PathVariable Long entryId) {
        return actionService.addMissingToShoppingList(entryId);
    }
}
