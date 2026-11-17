package de.roman.speiseplan.dashboard;

import de.roman.speiseplan.schedule.ScheduleService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DashboardController {
    private final DashboardService dashboardService;
    private final HomeService homeService;

    public DashboardController(DashboardService dashboardService, HomeService homeService) {
        this.dashboardService = dashboardService;
        this.homeService = homeService;
    }

    @GetMapping("/api/home")
    public HomeDto getHome(
            @RequestParam(defaultValue = "7") @Min(4) @Max(ScheduleService.MAX_DAYS) int days,
            @AuthenticationPrincipal(errorOnInvalidType = false) OAuth2User user) {
        Object email = user == null ? null : user.getAttributes().get("email");
        return homeService.home(days, user == null ? null : email == null ? user.getName() : email.toString());
    }

    @GetMapping("/api/dashboard")
    public DashboardDto getDashboard() {
        return dashboardService.getDashboard();
    }

    @GetMapping("/api/dashboard/week")
    public WeekNutritionDto getWeek() {
        return dashboardService.getWeek();
    }

    @PatchMapping("/api/plan-entries/{planEntryId}/cook")
    public DashboardDto markCooked(@PathVariable Long planEntryId) {
        dashboardService.markCooked(planEntryId);
        return dashboardService.getDashboard();
    }
}
