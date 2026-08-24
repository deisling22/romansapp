package de.roman.speiseplan.sync;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;

public record SyncPlanRequest(
        @NotBlank @Size(max = 36) String clientId,
        @NotBlank @Size(max = 120) String name,
        @NotNull Instant updatedAt,
        @NotNull List<@Valid SyncDishRequest> dishes) {
}