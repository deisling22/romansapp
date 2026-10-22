package de.roman.speiseplan.shopping;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** Basic supplies (e.g. breakfast items) that every upcoming-shopping list tops up. */
@Entity
@Table(name = "staple_item")
public class StapleItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ingredient_name", nullable = false, length = 120)
    private String ingredientName;

    @Column(nullable = false)
    private double quantity;

    @Column(nullable = false, length = 20)
    private String unit;

    protected StapleItem() {
    }

    public StapleItem(String ingredientName, double quantity, String unit) {
        this.ingredientName = ingredientName;
        this.quantity = quantity;
        this.unit = unit;
    }

    public Long getId() {
        return id;
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
}
