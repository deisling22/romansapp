package de.roman.speiseplan.dish;

public record PrepStepDto(Long id, int stepOrder, String text, Integer timerSeconds) {
}
