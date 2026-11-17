package de.roman.speiseplan.dashboard;

import de.roman.speiseplan.pantry.UseSoonDto;
import de.roman.speiseplan.schedule.ScheduleDtos.ScheduleDto;

/** Everything the start screen shows; {@code week} is only filled when nutrition tracking is on. */
public record HomeDto(DashboardDto dashboard, ScheduleDto schedule, UseSoonDto useSoon, WeekNutritionDto week) {
}
