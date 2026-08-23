package de.roman.speiseplan.pantry;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record AddPantryBatchRequest(@NotEmpty List<@Valid AddPantryItemRequest> items) {
}