package de.roman.speiseplan.recommendation;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

/** "Less of this": the household does not want to see this dish in its suggestions any more. */
@Entity
@Table(name = "dish_feedback")
@org.hibernate.annotations.Filter(name = de.roman.speiseplan.household.HouseholdScope.FILTER)
public class DishFeedback {
    @Column(name = "household_id", nullable = false)
    private Long householdId = de.roman.speiseplan.household.HouseholdContext.currentId();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "dish_id", nullable = false)
    private Long dishId;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    protected DishFeedback() {
    }

    public DishFeedback(Long dishId) {
        this.dishId = dishId;
    }

    public Long getDishId() {
        return dishId;
    }
}
