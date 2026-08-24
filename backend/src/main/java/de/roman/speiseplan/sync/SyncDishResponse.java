package de.roman.speiseplan.sync;

import java.time.Instant;

public record SyncDishResponse(Long serverId, String clientId, String name, String imageUrl, Instant updatedAt) {
}