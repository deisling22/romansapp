package de.roman.speiseplan.dish;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "dish")
public class Dish {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(name = "image_url", nullable = false, length = 255)
    private String imageUrl;

    @Column(length = 2000)
    private String description;

    @Column(name = "prep_minutes")
    private Integer prepMinutes;

    @Column(nullable = false)
    private int servings = 1;

    @Column(length = 255)
    private String tags;

    @Column(name = "carbs_grams")
    private Double carbsGrams;

    @Column(name = "fat_grams")
    private Double fatGrams;

    @Column(name = "vitamin_a_mcg")
    private Double vitaminAMcg;

    @Column(name = "vitamin_c_mg")
    private Double vitaminCMg;

    @Column(name = "vitamin_d_mcg")
    private Double vitaminDMcg;

    @Column(name = "vitamin_k_mcg")
    private Double vitaminKMcg;

    @Column(name = "vitamin_b12_mcg")
    private Double vitaminB12Mcg;

    @Column(name = "folate_mcg")
    private Double folateMcg;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "client_id", length = 36)
    private String clientId;

    @Column(name = "owner_email", length = 320)
    private String ownerEmail;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    protected Dish() {
    }

    public Dish(String name, String imageUrl) {
        this.name = name;
        this.imageUrl = imageUrl;
    }

    public Dish(String name, String imageUrl, String clientId, String ownerEmail, Instant updatedAt) {
        this.name = name;
        this.imageUrl = imageUrl;
        this.clientId = clientId;
        this.ownerEmail = ownerEmail;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getPrepMinutes() {
        return prepMinutes;
    }

    public void setPrepMinutes(Integer prepMinutes) {
        this.prepMinutes = prepMinutes;
    }

    public int getServings() {
        return servings;
    }

    public void setServings(int servings) {
        this.servings = servings;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public Double getCarbsGrams() {
        return carbsGrams;
    }

    public Double getFatGrams() {
        return fatGrams;
    }

    public Double getVitaminAMcg() {
        return vitaminAMcg;
    }

    public Double getVitaminCMg() {
        return vitaminCMg;
    }

    public Double getVitaminDMcg() {
        return vitaminDMcg;
    }

    public Double getVitaminKMcg() {
        return vitaminKMcg;
    }

    public Double getVitaminB12Mcg() {
        return vitaminB12Mcg;
    }

    public Double getFolateMcg() {
        return folateMcg;
    }

    public void updateNutrition(
            Double carbsGrams,
            Double fatGrams,
            Double vitaminAMcg,
            Double vitaminCMg,
            Double vitaminDMcg,
            Double vitaminKMcg,
            Double vitaminB12Mcg,
            Double folateMcg) {
        this.carbsGrams = carbsGrams;
        this.fatGrams = fatGrams;
        this.vitaminAMcg = vitaminAMcg;
        this.vitaminCMg = vitaminCMg;
        this.vitaminDMcg = vitaminDMcg;
        this.vitaminKMcg = vitaminKMcg;
        this.vitaminB12Mcg = vitaminB12Mcg;
        this.folateMcg = folateMcg;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public String getClientId() {
        return clientId;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void updateFromSync(String name, String imageUrl, Instant updatedAt) {
        this.name = name;
        if (imageUrl != null) {
            this.imageUrl = imageUrl;
        }
        this.updatedAt = updatedAt;
    }
}