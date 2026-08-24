package de.roman.speiseplan.recommendation;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Tracks how "hot" a piece of content currently is, cross-user, using an exponentially
 * decayed score (half-life based) so recent engagement outweighs old engagement without
 * needing a scheduled batch job.
 */
@Service
public class TrendScoringService {
    private static final double HALF_LIFE_HOURS = 96;

    private final ContentTrendScoreRepository repository;

    public TrendScoringService(ContentTrendScoreRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public void bump(ContentType type, Long contentId, double weight) {
        if (contentId == null) {
            return;
        }
        Instant now = Instant.now();
        String key = type.name() + ":" + contentId;
        ContentTrendScore trend = repository.findById(key)
                .orElseGet(() -> new ContentTrendScore(key, type, contentId));
        double decayed = decay(trend.getScore(), trend.getLastEventAt(), now);
        trend.update(Math.max(0, decayed + weight), now);
        repository.save(trend);
    }

    @Transactional(readOnly = true)
    public Map<Long, Double> currentScores(ContentType type, List<Long> contentIds) {
        if (contentIds.isEmpty()) {
            return Map.of();
        }
        Instant now = Instant.now();
        return repository.findByContentTypeAndContentIdIn(type, contentIds).stream()
                .collect(Collectors.toMap(
                        ContentTrendScore::getContentId,
                        trend -> decay(trend.getScore(), trend.getLastEventAt(), now)));
    }

    private static double decay(double score, Instant lastEventAt, Instant now) {
        if (score <= 0 || lastEventAt == null) {
            return 0;
        }
        double hours = Duration.between(lastEventAt, now).toMillis() / 3_600_000.0;
        if (hours <= 0) {
            return score;
        }
        return score * Math.pow(0.5, hours / HALF_LIFE_HOURS);
    }
}
