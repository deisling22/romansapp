package de.roman.speiseplan.cost;

import de.roman.speiseplan.household.HouseholdContext;
import de.roman.speiseplan.household.HouseholdScope;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;
import org.hibernate.annotations.Filter;

/** A photographed or manually entered shopping receipt; only the total counts as household spending. */
@Entity
@Table(name = "receipt")
@Filter(name = HouseholdScope.FILTER)
public class Receipt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "household_id", nullable = false)
    private Long householdId = HouseholdContext.currentId();

    @Column(name = "purchased_on", nullable = false)
    private LocalDate purchasedOn;

    @Column(name = "total_eur", nullable = false)
    private double totalEur;

    @Column(length = 120)
    private String store;

    @Column(name = "created_by", length = 320)
    private String createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected Receipt() {
    }

    public Receipt(LocalDate purchasedOn, double totalEur, String store, String createdBy) {
        this.purchasedOn = purchasedOn;
        this.totalEur = totalEur;
        this.store = store;
        this.createdBy = createdBy;
    }

    public Long getId() {
        return id;
    }

    public LocalDate getPurchasedOn() {
        return purchasedOn;
    }

    public double getTotalEur() {
        return totalEur;
    }

    public String getStore() {
        return store;
    }

    public String getCreatedBy() {
        return createdBy;
    }
}
