package de.roman.speiseplan.pantry;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

/**
 * Stock that expires soon plus dishes that would use it up. {@code todayEntry} is the next open plan
 * entry a suggestion can take over (today if possible); {@code wastedThisMonth} counts items thrown
 * away this month.
 */
public record UseSoonDto(List<Item> items, List<DishSuggestion> dishes, TodayEntry todayEntry, long wastedThisMonth) {
    /** {@code planned}: the upcoming plan already uses this stock up before it expires. */
    public record Item(
            Long id, String ingredientName, double quantity, String unit, Instant purchasedAt, LocalDate expiresOn,
            boolean planned) {
    }

    public record DishSuggestion(
            Long id,
            String name,
            String imageUrl,
            Integer prepMinutes,
            List<String> matchedIngredients,
            int missingCount,
            int coveragePercent,
            boolean liked) {
    }

    public record TodayEntry(Long planEntryId, Long dishId, String dishName, int dayOffset) {
    }
}
