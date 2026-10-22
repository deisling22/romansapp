package de.roman.speiseplan.household;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HouseholdMemberRepository extends JpaRepository<HouseholdMember, String> {
    List<HouseholdMember> findByHouseholdIdOrderByJoinedAtAsc(Long householdId);

    long countByHouseholdId(Long householdId);
}
