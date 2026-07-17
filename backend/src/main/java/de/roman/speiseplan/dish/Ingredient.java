package de.roman.speiseplan.dish;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "ingredient")
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(name = "kcal_per_100", nullable = false)
    private double kcalPer100;

    @Column(name = "protein_per_100", nullable = false)
    private double proteinPer100;

    @Column(nullable = false, length = 20)
    private String unit = "g";

    protected Ingredient() {
    }

    public Ingredient(String name, double kcalPer100, double proteinPer100, String unit) {
        this.name = name;
        this.kcalPer100 = kcalPer100;
        this.proteinPer100 = proteinPer100;
        this.unit = unit;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public double getKcalPer100() {
        return kcalPer100;
    }

    public double getProteinPer100() {
        return proteinPer100;
    }

    public String getUnit() {
        return unit;
    }
}
