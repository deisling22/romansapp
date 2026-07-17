package de.roman.speiseplan.shopping;

import jakarta.validation.constraints.NotNull;

public record UpdateShoppingListItemRequest(@NotNull Boolean checked) {
}
