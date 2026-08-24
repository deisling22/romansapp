package de.roman.speiseplan.creator;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CreatorSubscriptionRepository extends JpaRepository<CreatorSubscription, Long> {
    Optional<CreatorSubscription> findByOwnerEmailAndCreatorId(String ownerEmail, Long creatorId);

    List<CreatorSubscription> findByOwnerEmail(String ownerEmail);

    void deleteByOwnerEmailAndCreatorId(String ownerEmail, Long creatorId);
}