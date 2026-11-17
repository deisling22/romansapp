package de.roman.speiseplan.dashboard;

import de.roman.speiseplan.pantry.UseSoonService;
import de.roman.speiseplan.schedule.ScheduleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * The start screen in one request: the schedule is computed once and shared by plan, figures and
 * "use soon". On the small production instance every saved query and round trip is noticeable.
 */
@Service
public class HomeService {
    private final ScheduleService scheduleService;
    private final DashboardService dashboardService;
    private final UseSoonService useSoonService;

    public HomeService(
            ScheduleService scheduleService, DashboardService dashboardService, UseSoonService useSoonService) {
        this.scheduleService = scheduleService;
        this.dashboardService = dashboardService;
        this.useSoonService = useSoonService;
    }

    @Transactional(readOnly = true)
    public HomeDto home(int days, String ownerEmail) {
        ScheduleService.Schedule schedule = scheduleService.compute(days);
        DashboardDto dashboard = dashboardService.getDashboard(schedule);
        return new HomeDto(
                dashboard,
                scheduleService.toDto(schedule),
                useSoonService.useSoon(ownerEmail, schedule),
                dashboard.nutritionTrackingEnabled() ? dashboardService.getWeek() : null);
    }
}
