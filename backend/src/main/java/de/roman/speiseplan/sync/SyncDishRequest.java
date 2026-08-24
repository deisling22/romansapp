package de.roman.speiseplan.sync;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public record SyncDishRequest(
        @NotBlank @Size(max = 36) String clientId,
        @NotBlank @Size(max = 120) String name,
        @NotNull Instant updatedAt,
        String imageDataUrl) {
}