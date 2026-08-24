package de.roman.speiseplan.gamification;

import org.springframework.data.jpa.repository.JpaRepository;

public interface GamificationProfileRepository extends JpaRepository<GamificationProfile, String> {
}