package de.roman.speiseplan.profile;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_profile")
public class UserProfile {
    public static final long SINGLETON_ID = 1L;

    @Id
    private Long id = SINGLETON_ID;

    @Column(name = "default_portion_size", nullable = false)
    private double defaultPortionSize = 1;

    @Column(name = "body_weight_kg")
    private Double bodyWeightKg;

    @Column(name = "body_height_cm")
    private Double bodyHeightCm;

    @Column(name = "nutrition_tracking_enabled", nullable = false)
    private boolean nutritionTrackingEnabled = false;

    @Column(name = "calorie_goal")
    private Double calorieGoal;

    @Column(name = "age")
    private Integer age;

    @Column(name = "sex")
    private String sex;

    @Column(name = "activity_level")
    private Double activityLevel;

    @Column(name = "household_size", nullable = false)
    private int householdSize = 1;

    @Column(name = "shopping_trips_per_week", nullable = false)
    private int shoppingTripsPerWeek = 2;

    @Column(name = "cost_tracking_enabled", nullable = false)
    private boolean costTrackingEnabled = false;

    @Column(name = "weekly_budget_eur")
    private Double weeklyBudgetEur;

    protected UserProfile() {
    }

    /** One profile per household; the id equals the household id. */
    UserProfile(Long householdId) {
        this.id = householdId;
    }

    public boolean isCostTrackingEnabled() {
        return costTrackingEnabled;
    }

    public void setCostTrackingEnabled(boolean costTrackingEnabled) {
        this.costTrackingEnabled = costTrackingEnabled;
    }

    public Double getWeeklyBudgetEur() {
        return weeklyBudgetEur;
    }

    public void setWeeklyBudgetEur(Double weeklyBudgetEur) {
        this.weeklyBudgetEur = weeklyBudgetEur;
    }

    public Long getId() {
        return id;
    }

    public double getDefaultPortionSize() {
        return defaultPortionSize;
    }

    public void setDefaultPortionSize(double defaultPortionSize) {
        this.defaultPortionSize = defaultPortionSize;
    }

    public Double getBodyWeightKg() {
        return bodyWeightKg;
    }

    public void setBodyWeightKg(Double bodyWeightKg) {
        this.bodyWeightKg = bodyWeightKg;
    }

    public Double getBodyHeightCm() {
        return bodyHeightCm;
    }

    public void setBodyHeightCm(Double bodyHeightCm) {
        this.bodyHeightCm = bodyHeightCm;
    }

    public boolean isNutritionTrackingEnabled() {
        return nutritionTrackingEnabled;
    }

    public void setNutritionTrackingEnabled(boolean nutritionTrackingEnabled) {
        this.nutritionTrackingEnabled = nutritionTrackingEnabled;
    }

    public Double getCalorieGoal() {
        return calorieGoal;
    }

    public void setCalorieGoal(Double calorieGoal) {
        this.calorieGoal = calorieGoal;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public Double getActivityLevel() {
        return activityLevel;
    }

    public void setActivityLevel(Double activityLevel) {
        this.activityLevel = activityLevel;
    }

    public int getHouseholdSize() {
        return householdSize;
    }

    public void setHouseholdSize(int householdSize) {
        this.householdSize = householdSize;
    }

    public int getShoppingTripsPerWeek() {
        return shoppingTripsPerWeek;
    }

    public void setShoppingTripsPerWeek(int shoppingTripsPerWeek) {
        this.shoppingTripsPerWeek = shoppingTripsPerWeek;
    }
}
