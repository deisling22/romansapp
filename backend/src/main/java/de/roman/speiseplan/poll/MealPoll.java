package de.roman.speiseplan.poll;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "meal_poll")
public class MealPoll {
    @Id
    @Column(length = 36)
    private String id = UUID.randomUUID().toString();
    @Column(name = "owner_email", nullable = false, length = 320)
    private String ownerEmail;
    @Column(name = "household_id", nullable = false)
    private long householdId;
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;
    @Column(nullable = false)
    private boolean closed;
    @ElementCollection
    @CollectionTable(name = "meal_poll_option", joinColumns = @JoinColumn(name = "poll_id"))
    @OrderColumn(name = "option_index")
    private List<MealPollOption> options = new ArrayList<>();

    protected MealPoll() {
    }

    public MealPoll(String ownerEmail, long householdId, List<MealPollOption> options, Instant now) {
        this.ownerEmail = ownerEmail;
        this.householdId = householdId;
        this.options.addAll(options);
        createdAt = now;
        expiresAt = now.plus(Duration.ofDays(5));
    }

    public String getId() { return id; }
    public String getOwnerEmail() { return ownerEmail; }
    public long getHouseholdId() { return householdId; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getExpiresAt() { return expiresAt; }
    public boolean isClosed() { return closed; }
    public void close() { closed = true; }
    public List<MealPollOption> getOptions() { return options; }
}
