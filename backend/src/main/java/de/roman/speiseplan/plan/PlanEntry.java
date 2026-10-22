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
@Table(name = "plan_entry")
@org.hibernate.annotations.Filter(
        name = de.roman.speiseplan.household.HouseholdScope.FILTER,
        condition = de.roman.speiseplan.household.HouseholdScope.SHARED_CONDITION)
public class PlanEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "plan_id", nullable = false)
    private MealPlan plan;

    @ManyToOne(optional = false)
    @JoinColumn(name = "dish_id", nullable = false)
    private Dish dish;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @Column(nullable = false)
    private boolean cooked = false;

    @Column(name = "cooked_at")
    private Instant cookedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "meal_slot", nullable = false, length = 20)
    private MealSlot mealSlot = MealSlot.DINNER;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "household_id")
    private Long householdId;

    protected PlanEntry() {
    }

    public PlanEntry(MealPlan plan, Dish dish, int sortOrder) {
        this.plan = plan;
        this.dish = dish;
        this.sortOrder = sortOrder;
        this.householdId = plan.getHouseholdId();
    }

    public Long getId() {
        return id;
    }

    public MealPlan getPlan() {
        return plan;
    }

    public Dish getDish() {
        return dish;
    }

    public int getSortOrder() {
        return sortOrder;
    }

    public boolean isCooked() {
        return cooked;
    }

    public Instant getCookedAt() {
        return cookedAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void markCooked(Instant when) {
        this.cooked = true;
        this.cookedAt = when;
    }

    public void resetCooked() {
        this.cooked = false;
    }

    public MealSlot getMealSlot() {
        return mealSlot;
    }

    public void setMealSlot(MealSlot mealSlot) {
        this.mealSlot = mealSlot;
    }

    public void setDish(Dish dish) {
        this.dish = dish;
    }

    public void setSortOrder(int sortOrder) {
        this.sortOrder = sortOrder;
    }
}