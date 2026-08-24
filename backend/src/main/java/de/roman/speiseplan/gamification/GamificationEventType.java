package de.roman.speiseplan.gamification;

public enum GamificationEventType {
    COOK_DISH(20),
    CREATE_RECIPE(30),
    CREATE_PLAN(10),
    COMPLETE_PLAN(75),
    TRY_NEW_DISH(15),
    COMPLETE_SHOPPING(10),
    RATE_RECIPE(5),
    PANTRY_MEAL(20),
    OFFLINE_RECIPE_SYNCED(20),
    CREATOR_RECIPE_COOKED(25),
    DAILY_COOK_GOAL(15),
    DAILY_RATE_GOAL(5),
    WEEKLY_COOK_GOAL(50),
    WEEKLY_NEW_RECIPE_GOAL(20),
    WEEKLY_PLAN_GOAL(40),
    SEASONAL_GOAL(120),
    CREATOR_GOAL(80),
    HOUSEHOLD_GOAL(100);

    private final int xp;

    GamificationEventType(int xp) {
        this.xp = xp;
    }

    public int xp() {
        return xp;
    }
}