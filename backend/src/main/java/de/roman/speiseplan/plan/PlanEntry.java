package de.roman.speiseplan.plan;

import de.roman.speiseplan.dish.Dish;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "plan_entry")
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

    protected PlanEntry() {
    }

    public PlanEntry(MealPlan plan, Dish dish, int sortOrder) {
        this.plan = plan;
        this.dish = dish;
        this.sortOrder = sortOrder;
    }

    public Dish getDish() {
        return dish;
    }

    public int getSortOrder() {
        return sortOrder;
    }
}