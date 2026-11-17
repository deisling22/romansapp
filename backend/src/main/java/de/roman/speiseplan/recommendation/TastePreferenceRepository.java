package de.roman.speiseplan.recommendation;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TastePreferenceRepository extends JpaRepository<TastePreference, Long> {
}
