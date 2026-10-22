package de.roman.speiseplan.plan;

import de.roman.speiseplan.dish.Dish;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "cook_log")
public class CookLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "plan_entry_id")
    private Long planEntryId;

    @Column(name = "plan_id")
    private Long planId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "dish_id", nullable = false)
    private Dish dish;

    @Enumerated(EnumType.STRING)
    @Column(name = "meal_slot", nullable = false, length = 20)
    private MealSlot mealSlot;

    @Column(nullable = false)
    private boolean leftovers;

    @Column(name = "cooked_at", nullable = false)
    private Instant cookedAt;

    protected CookLog() {
    }

    public CookLog(PlanEntry entry, boolean leftovers, Instant cookedAt) {
        this.planEntryId = entry.getId();
        this.planId = entry.getPlan().getId();
        this.dish = entry.getDish();
        this.mealSlot = entry.getMealSlot();
        this.leftovers = leftovers;
        this.cookedAt = cookedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getPlanEntryId() {
        return planEntryId;
    }

    public Long getPlanId() {
        return planId;
    }

    public Dish getDish() {
        return dish;
    }

    public MealSlot getMealSlot() {
        return mealSlot;
    }

    public boolean isLeftovers() {
        return leftovers;
    }

    public Instant getCookedAt() {
        return cookedAt;
    }
}
