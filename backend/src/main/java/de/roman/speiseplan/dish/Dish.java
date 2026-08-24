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