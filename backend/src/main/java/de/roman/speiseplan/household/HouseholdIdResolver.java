package de.roman.speiseplan.household;

import java.util.function.Supplier;

public class HouseholdIdResolver implements Supplier<Long> {
    @Override
    public Long get() {
        return HouseholdContext.currentId();
    }
}
