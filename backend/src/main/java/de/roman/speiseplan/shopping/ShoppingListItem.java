package de.roman.speiseplan.shopping;

import de.roman.speiseplan.plan.MealPlan;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "shopping_list_item")
public class ShoppingListItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "plan_id")
    private MealPlan plan;

    @Column(name = "ingredient_name", nullable = false, length = 120)
    private String ingredientName;

    @Column(nullable = false)
    private double quantity;

    @Column(nullable = false, length = 20)
    private String unit;

    @Column(nullable = false)
    private boolean checked = false;

    protected ShoppingListItem() {
    }

    public ShoppingListItem(MealPlan plan, String ingredientName, double quantity, String unit) {
        this.plan = plan;
        this.ingredientName = ingredientName;
        this.quantity = quantity;
        this.unit = unit;
    }

    public ShoppingListItem(String ingredientName, double quantity, String unit) {
        this(null, ingredientName, quantity, unit);
    }

    public Long getId() {
        return id;
    }

    public MealPlan getPlan() {
        return plan;
    }

    public String getIngredientName() {
        return ingredientName;
    }

    public double getQuantity() {
        return quantity;
    }

    public String getUnit() {
        return unit;
    }

    public boolean isChecked() {
        return checked;
    }

    public void addQuantity(double additionalQuantity) {
        this.quantity += additionalQuantity;
        this.checked = false;
    }

    public void setQuantity(double quantity) {
        this.quantity = quantity;
    }

    public void setChecked(boolean checked) {
        this.checked = checked;
    }
}
