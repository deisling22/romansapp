package de.roman.speiseplan.gamification;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GamificationEventRepository extends JpaRepository<GamificationEvent, Long> {
    boolean existsByOwnerEmailAndEventId(String ownerEmail, String eventId);

        boolean existsByOwnerEmailAndEventTypeAndReferenceId(
            String ownerEmail, GamificationEventType eventType, String referenceId);

    List<GamificationEvent> findByOwnerEmailOrderByOccurredAtAsc(String ownerEmail);
}