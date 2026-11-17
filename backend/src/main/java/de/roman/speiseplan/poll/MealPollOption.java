package de.roman.speiseplan.poll;

import de.roman.speiseplan.plan.PlanEntry;
import de.roman.speiseplan.plan.MealSlot;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Embeddable
public class MealPollOption {
    @Column(name = "entry_id", nullable = false)
    private Long entryId;
    @Column(name = "dish_id", nullable = false)
    private Long dishId;
    @Column(nullable = false, length = 120)
    private String name;
    @Column(name = "image_url", nullable = false, length = 1000)
    private String imageUrl;
    @Enumerated(EnumType.STRING)
    @Column(name = "meal_slot", nullable = false, length = 20)
    private MealSlot mealSlot;

    protected MealPollOption() {
    }

    public MealPollOption(PlanEntry entry) {
        entryId = entry.getId();
        dishId = entry.getDish().getId();
        name = entry.getDish().getName();
        imageUrl = entry.getDish().getImageUrl();
        mealSlot = entry.getMealSlot();
    }

    public Long getEntryId() { return entryId; }
    public Long getDishId() { return dishId; }
    public String getName() { return name; }
    public String getImageUrl() { return imageUrl; }
    public MealSlot getMealSlot() { return mealSlot; }
}
