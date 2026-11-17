package de.roman.speiseplan.poll;

import jakarta.persistence.LockModeType;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface MealPollRepository extends JpaRepository<MealPoll, String> {
    List<MealPoll> findByOwnerEmailAndHouseholdIdAndExpiresAtAfterOrderByCreatedAtDesc(
            String ownerEmail, long householdId, Instant now);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from MealPoll p where p.id = :id")
    Optional<MealPoll> lockById(String id);

    @Modifying
    @Query("delete from MealPoll p where p.expiresAt <= :now")
    int deleteExpired(Instant now);
}
