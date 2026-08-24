package de.roman.speiseplan.creator;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CreatorRepository extends JpaRepository<Creator, Long> {
	Optional<Creator> findByHandle(String handle);
}