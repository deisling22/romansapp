package de.roman.speiseplan.creator;

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
@Table(name = "creator_subscription")
public class CreatorSubscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "owner_email", nullable = false, length = 320)
    private String ownerEmail;

    @ManyToOne(optional = false)
    @JoinColumn(name = "creator_id", nullable = false)
    private Creator creator;

    @Column(name = "subscribed_at", nullable = false, updatable = false)
    private Instant subscribedAt = Instant.now();

    @Column(name = "last_checked_at", nullable = false)
    private Instant lastCheckedAt = Instant.now();

    protected CreatorSubscription() {
    }

    public CreatorSubscription(String ownerEmail, Creator creator) {
        this.ownerEmail = ownerEmail;
        this.creator = creator;
    }

    public Creator getCreator() {
        return creator;
    }

    public Instant getLastCheckedAt() {
        return lastCheckedAt;
    }

    public void markChecked(Instant checkedAt) {
        this.lastCheckedAt = checkedAt;
    }
}