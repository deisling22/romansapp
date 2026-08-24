package de.roman.speiseplan.creator;

public record CreatorNotificationDto(Long creatorId, String creatorName, long newPlanCount, long newDishCount) {
}