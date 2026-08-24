package de.roman.speiseplan.plan;

import de.roman.speiseplan.creator.Creator;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "meal_plan")
public class MealPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private Creator creator;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "client_id", length = 36)
    private String clientId;

    @Column(name = "owner_email", length = 320)
    private String ownerEmail;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    protected MealPlan() {
    }

    public MealPlan(String name) {
        this.name = name;
    }

    public MealPlan(String name, Creator creator) {
        this.name = name;
        this.creator = creator;
    }

    public MealPlan(String name, String clientId, String ownerEmail, Instant updatedAt) {
        this.name = name;
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

    public Creator getCreator() {
        return creator;
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

    public void updateFromSync(String name, Instant updatedAt) {
        this.name = name;
        this.updatedAt = updatedAt;
    }
}