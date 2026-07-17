package de.roman.speiseplan.plan;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreatePlanRequest(@NotBlank @Size(max = 120) String name) {
}
