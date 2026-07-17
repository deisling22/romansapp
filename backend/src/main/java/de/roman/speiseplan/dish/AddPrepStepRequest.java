package de.roman.speiseplan.dish;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record AddPrepStepRequest(@NotBlank String text, @Positive Integer timerSeconds) {
}
