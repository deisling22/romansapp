package de.roman.speiseplan.household;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

/**
 * Tenant boundary: plans, dishes, shopping list, pantry, staples, cook log, receipts and the profile
 * belong to exactly one household. Rows with a null household id are the public catalog (creator plans).
 */
@Entity
@Table(name = "household")
@FilterDef(
        name = HouseholdScope.FILTER,
        parameters = @ParamDef(name = HouseholdScope.PARAM, type = Long.class, resolver = HouseholdIdResolver.class),
        defaultCondition = HouseholdScope.PRIVATE_CONDITION,
        autoEnabled = true,
        applyToLoadByKey = true)
public class Household {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(name = "invite_code", length = 16, unique = true)
    private String inviteCode;

    @Column(nullable = false)
    private boolean guest;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected Household() {
    }

    public Household(String name, boolean guest) {
        this.name = name;
        this.guest = guest;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getInviteCode() {
        return inviteCode;
    }

    public void setInviteCode(String inviteCode) {
        this.inviteCode = inviteCode;
    }

    public boolean isGuest() {
        return guest;
    }
}
