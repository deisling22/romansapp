package de.roman.speiseplan.recommendation;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

/** Cross-user, decayed engagement score for a single piece of content (dish, creator or plan). */
@Entity
@Table(name = "content_trend_score")
public class ContentTrendScore {
    @Id
    @Column(name = "content_key", length = 40)
    private String contentKey;

    @Enumerated(EnumType.STRING)
    @Column(name = "content_type", nullable = false, length = 20)
    private ContentType contentType;

    @Column(name = "content_id", nullable = false)
    private Long contentId;

    @Column(nullable = false)
    private double score;

    @Column(name = "last_event_at", nullable = false)
    private Instant lastEventAt;

    protected ContentTrendScore() {
    }

    public ContentTrendScore(String contentKey, ContentType contentType, Long contentId) {
        this.contentKey = contentKey;
        this.contentType = contentType;
        this.contentId = contentId;
        this.lastEventAt = Instant.now();
    }

    public double getScore() {
        return score;
    }

    public Instant getLastEventAt() {
        return lastEventAt;
    }

    public Long getContentId() {
        return contentId;
    }

    public void update(double score, Instant lastEventAt) {
        this.score = score;
        this.lastEventAt = lastEventAt;
    }
}
