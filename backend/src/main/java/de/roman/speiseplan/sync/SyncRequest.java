package de.roman.speiseplan.sync;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record SyncRequest(@NotNull List<@Valid SyncPlanRequest> plans) {
}