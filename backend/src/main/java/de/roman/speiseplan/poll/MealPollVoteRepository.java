package de.roman.speiseplan.poll;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MealPollVoteRepository extends JpaRepository<MealPollVote, Long> {
    List<MealPollVote> findByPollIdOrderByIdAsc(String pollId);
    Optional<MealPollVote> findByPollIdAndNameKey(String pollId, String nameKey);
}
