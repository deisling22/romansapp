package de.roman.speiseplan.household;

/** Household of the current request; code running outside a request (seeding) uses the default household. */
public final class HouseholdContext {
    public static final long DEFAULT_HOUSEHOLD_ID = 1L;

    private static final ThreadLocal<Long> CURRENT = new ThreadLocal<>();

    private HouseholdContext() {
    }

    public static long currentId() {
        Long id = CURRENT.get();
        return id == null ? DEFAULT_HOUSEHOLD_ID : id;
    }

    public static void set(long householdId) {
        CURRENT.set(householdId);
    }

    public static void clear() {
        CURRENT.remove();
    }
}
