package de.roman.speiseplan.pantry;

import java.time.Instant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PantryRemovalRepository extends JpaRepository<PantryRemoval, Long> {
    long countByReasonAndRemovedAtGreaterThanEqual(PantryRemoval.Reason reason, Instant since);
}
