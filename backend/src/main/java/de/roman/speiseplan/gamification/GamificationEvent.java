package de.roman.speiseplan.gamification;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;

@Entity
@Table(name = "gamification_event", uniqueConstraints =
        @UniqueConstraint(name = "uk_gamification_event_owner", columnNames = {"owner_email", "event_id"}))
public class GamificationEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_id", nullable = false, length = 36)
    private String eventId;

    @Column(name = "owner_email", nullable = false, length = 320)
    private String ownerEmail;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false, length = 40)
    private GamificationEventType eventType;

    @Column(name = "reference_id", length = 120)
    private String referenceId;

    @Column(name = "occurred_at", nullable = false)
    private Instant occurredAt;

    protected GamificationEvent() {
    }

    public GamificationEvent(
            String eventId, String ownerEmail, GamificationEventType eventType, String referenceId, Instant occurredAt) {
        this.eventId = eventId;
        this.ownerEmail = ownerEmail;
        this.eventType = eventType;
        this.referenceId = referenceId;
        this.occurredAt = occurredAt;
    }

    public GamificationEventType getEventType() {
        return eventType;
    }

    public String getReferenceId() {
        return referenceId;
    }

    public Instant getOccurredAt() {
        return occurredAt;
    }
}