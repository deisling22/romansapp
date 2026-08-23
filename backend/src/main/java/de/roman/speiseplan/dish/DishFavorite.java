package de.roman.speiseplan.dish;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;

@Entity
@Table(name = "dish_favorite", uniqueConstraints = @UniqueConstraint(columnNames = {"dish_id", "user_email"}))
public class DishFavorite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "dish_id", nullable = false)
    private Dish dish;

    @Column(name = "user_email", nullable = false, length = 255)
    private String userEmail;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected DishFavorite() {
    }

    public DishFavorite(Dish dish, String userEmail) {
        this.dish = dish;
        this.userEmail = userEmail;
    }

    public Long getId() {
        return id;
    }

    public Dish getDish() {
        return dish;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}