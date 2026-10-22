package de.roman.speiseplan.household;

/** Names and SQL conditions of the Hibernate filter that isolates households. */
public final class HouseholdScope {
    public static final String FILTER = "householdFilter";
    public static final String PARAM = "householdId";
    public static final String PRIVATE_CONDITION = "household_id = :householdId";
    /** Own rows plus the public catalog (creator plans and their dishes). */
    public static final String SHARED_CONDITION = "(household_id = :householdId or household_id is null)";

    private HouseholdScope() {
    }
}
