package de.roman.speiseplan.dish;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record RateDishRequest(@Min(1) @Max(5) int stars) {
}
