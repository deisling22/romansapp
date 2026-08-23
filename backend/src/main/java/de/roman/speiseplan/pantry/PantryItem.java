package de.roman.speiseplan.pantry;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "pantry_item")
public class PantryItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ingredient_name", nullable = false, length = 120)
    private String ingredientName;

    @Column(nullable = false)
    private double quantity;

    @Column(nullable = false, length = 20)
    private String unit;

    @Column(name = "purchased_at", nullable = false)
    private Instant purchasedAt;

    protected PantryItem() {
    }

    public PantryItem(String ingredientName, double quantity, String unit, Instant purchasedAt) {
        this.ingredientName = ingredientName;
        this.quantity = quantity;
        this.unit = unit;
        this.purchasedAt = purchasedAt;
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

    public Instant getPurchasedAt() {
        return purchasedAt;
    }

    public void setQuantity(double quantity) {
        this.quantity = quantity;
    }
}
