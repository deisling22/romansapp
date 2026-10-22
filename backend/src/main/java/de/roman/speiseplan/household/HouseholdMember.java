package de.roman.speiseplan.household;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "household_member")
public class HouseholdMember {
    public enum Role { OWNER, MEMBER }

    @Id
    @Column(length = 320)
    private String email;

    @Column(name = "household_id", nullable = false)
    private Long householdId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private Role role;

    @Column(name = "joined_at", nullable = false)
    private Instant joinedAt = Instant.now();

    protected HouseholdMember() {
    }

    public HouseholdMember(String email, Long householdId, Role role) {
        this.email = email;
        this.householdId = householdId;
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public Long getHouseholdId() {
        return householdId;
    }

    public Role getRole() {
        return role;
    }

    public Instant getJoinedAt() {
        return joinedAt;
    }

    public void moveTo(Long householdId, Role role) {
        this.householdId = householdId;
        this.role = role;
        this.joinedAt = Instant.now();
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
