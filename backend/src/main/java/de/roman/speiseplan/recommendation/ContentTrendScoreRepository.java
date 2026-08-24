package de.roman.speiseplan.recommendation;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContentTrendScoreRepository extends JpaRepository<ContentTrendScore, String> {
    List<ContentTrendScore> findByContentTypeAndContentIdIn(ContentType contentType, List<Long> contentIds);
}
