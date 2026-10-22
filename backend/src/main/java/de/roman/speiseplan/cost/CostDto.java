package de.roman.speiseplan.cost;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;

/** Manually entered cost in euro; null clears it. */
public record CostDto(@DecimalMin("0") @DecimalMax("100000") Double costEur) {
}
