package de.roman.speiseplan.dish;

public record DishDto(Long id, String name, String imageUrl, int sortOrder, Long planEntryId, boolean cooked) {
}