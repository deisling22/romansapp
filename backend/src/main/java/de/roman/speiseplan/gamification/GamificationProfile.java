package de.roman.speiseplan.gamification;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "gamification_profile")
public class GamificationProfile {
    @Id
    @Column(name = "owner_email", length = 320)
    private String ownerEmail;

    @Column(name = "selected_frame", nullable = false, length = 30)
    private String selectedFrame = "CLASSIC";

    @Column(name = "selected_title", nullable = false, length = 40)
    private String selectedTitle = "KUECHENSTARTER";

    @Column(name = "weekly_cook_target", nullable = false)
    private int weeklyCookTarget = 4;

    @Column(name = "household_weekly_target", nullable = false)
    private int householdWeeklyTarget = 8;

    protected GamificationProfile() {
    }

    public GamificationProfile(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }

    public String getSelectedFrame() {
        return selectedFrame;
    }

    public int getWeeklyCookTarget() {
        return weeklyCookTarget;
    }

    public String getSelectedTitle() {
        return selectedTitle;
    }

    public int getHouseholdWeeklyTarget() {
        return householdWeeklyTarget;
    }

    public void update(String selectedFrame, String selectedTitle, int weeklyCookTarget, int householdWeeklyTarget) {
        this.selectedFrame = selectedFrame;
        this.selectedTitle = selectedTitle;
        this.weeklyCookTarget = weeklyCookTarget;
        this.householdWeeklyTarget = householdWeeklyTarget;
    }
}