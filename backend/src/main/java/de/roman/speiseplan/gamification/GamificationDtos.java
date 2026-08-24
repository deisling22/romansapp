package de.roman.speiseplan.gamification;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;

public final class GamificationDtos {
    private GamificationDtos() {
    }

    public record EventRequest(
            @NotBlank @Size(max = 36) String eventId,
            @NotNull GamificationEventType type,
            @Size(max = 120) String referenceId,
            @NotNull Instant occurredAt) {
    }

    public record EventBatchRequest(@NotNull List<EventRequest> events) {
    }

    public record FrameDto(String id, String name, int requiredLevel, boolean unlocked) {
    }

        public record TitleDto(String id, String name, int requiredLevel, boolean unlocked) {
        }

    public record AchievementDto(
            String id, String name, String description, String tier, long progress, long target, boolean unlocked) {
    }

    public record GoalDto(String id, String name, long progress, long target, int bonusXp, boolean completed) {
    }

    public record ProgressDto(
            int xp,
            int level,
            int currentLevelXp,
            int nextLevelXp,
            int currentStreak,
            int bestStreak,
            boolean streakShieldAvailable,
            long cookedDishes,
            long uniqueDishes,
            long completedPlans,
            String selectedFrame,
            String selectedTitle,
            List<FrameDto> frames,
            List<TitleDto> titles,
            List<AchievementDto> achievements,
            List<GoalDto> dailyGoals,
            List<GoalDto> weeklyGoals,
            GoalDto seasonalChallenge,
            GoalDto creatorChallenge,
            GoalDto householdGoal) {
    }

    public record SettingsRequest(
            @NotBlank String selectedFrame,
            @NotBlank String selectedTitle,
            @Min(1) @Max(14) int weeklyCookTarget,
            @Min(1) @Max(30) int householdWeeklyTarget) {
    }
}