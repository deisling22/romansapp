package de.roman.speiseplan.dashboard;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/api/dashboard")
    public DashboardDto getDashboard() {
        return dashboardService.getDashboard();
    }

    @PatchMapping("/api/plan-entries/{planEntryId}/cook")
    public DashboardDto markCooked(@PathVariable Long planEntryId) {
        dashboardService.markCooked(planEntryId);
        return dashboardService.getDashboard();
    }
}
