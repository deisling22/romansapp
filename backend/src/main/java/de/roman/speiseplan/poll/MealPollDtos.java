package de.roman.speiseplan.poll;

import de.roman.speiseplan.plan.MealSlot;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;

public final class MealPollDtos {
    private MealPollDtos() {
    }

    public record Option(Long entryId, Long dishId, String name, String imageUrl, MealSlot mealSlot) {
        public static Option from(MealPollOption option) {
            return new Option(option.getEntryId(), option.getDishId(), option.getName(), option.getImageUrl(), option.getMealSlot());
        }
    }
    public record PublicPoll(String id, Instant createdAt, Instant expiresAt, boolean closed, List<Option> options) {
    }
    public record VoteRequest(@NotBlank @Size(max = 80) String name,
                              @NotNull @Size(min = 1, max = 10) List<@NotNull Long> ranking) {
    }
    public record VoteResult(String name, List<Long> ranking) {
    }
    public record Result(Option option, Double averageRank) {
    }
    public record ManagedPoll(PublicPoll poll, int voteCount, List<Result> results, List<VoteResult> votes) {
    }
    public record ApplyRequest(@Min(1) @Max(10) int count) {
    }
}
