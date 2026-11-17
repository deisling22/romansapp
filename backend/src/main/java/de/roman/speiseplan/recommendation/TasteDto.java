package de.roman.speiseplan.recommendation;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record TasteDto(List<String> availableTags, List<String> likedTags) {
    public record UpdateRequest(@NotNull @Size(max = 30) List<@Size(max = 60) String> likedTags) {
    }
}
