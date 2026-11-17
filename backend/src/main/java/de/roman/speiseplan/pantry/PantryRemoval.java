package de.roman.speiseplan.pantry;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

/** Records why stock left the pantry outside of cooking, so food waste becomes visible. */
@Entity
@Table(name = "pantry_removal")
@org.hibernate.annotations.Filter(name = de.roman.speiseplan.household.HouseholdScope.FILTER)
public class PantryRemoval {
    public enum Reason {
        USED,
        WASTED
    }

    @Column(name = "household_id", nullable = false)
    private Long householdId = de.roman.speiseplan.household.HouseholdContext.currentId();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ingredient_name", nullable = false, length = 120)
    private String ingredientName;

    @Column(nullable = false)
    private double quantity;

    @Column(nullable = false, length = 20)
    private String unit;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private Reason reason;

    @Column(name = "removed_at", nullable = false)
    private Instant removedAt;

    protected PantryRemoval() {
    }

    public PantryRemoval(PantryItem item, Reason reason, Instant removedAt) {
        this.ingredientName = item.getIngredientName();
        this.quantity = item.getQuantity();
        this.unit = item.getUnit();
        this.reason = reason;
        this.removedAt = removedAt;
    }
}
