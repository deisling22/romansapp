package de.roman.speiseplan.recommendation;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** Explicit taste of a household: liked tags from onboarding plus penalties from "less of this". */
@Entity
@Table(name = "taste_preference")
@org.hibernate.annotations.Filter(name = de.roman.speiseplan.household.HouseholdScope.FILTER)
public class TastePreference {
    @Column(name = "household_id", nullable = false)
    private Long householdId = de.roman.speiseplan.household.HouseholdContext.currentId();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 60)
    private String tag;

    @Column(nullable = false)
    private boolean liked;

    @Column(nullable = false)
    private double penalty;

    protected TastePreference() {
    }

    public TastePreference(String tag) {
        this.tag = tag;
    }

    public String getTag() {
        return tag;
    }

    public boolean isLiked() {
        return liked;
    }

    public void setLiked(boolean liked) {
        this.liked = liked;
    }

    public double getPenalty() {
        return penalty;
    }

    public void addPenalty(double amount) {
        this.penalty += amount;
    }
}
