package de.roman.speiseplan.dish;

import jakarta.validation.constraints.Size;

public record AdvancePrepRequest(@Size(max = 500) String note) {
}
