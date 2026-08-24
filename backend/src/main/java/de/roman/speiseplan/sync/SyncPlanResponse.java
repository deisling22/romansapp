package de.roman.speiseplan.sync;

import java.time.Instant;
import java.util.List;

public record SyncPlanResponse(
        Long serverId,
        String clientId,
        String name,
        Instant updatedAt,
        List<SyncDishResponse> dishes) {
}