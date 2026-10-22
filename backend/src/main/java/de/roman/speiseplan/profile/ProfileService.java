package de.roman.speiseplan.profile;

import de.roman.speiseplan.household.HouseholdContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {
    private final UserProfileRepository userProfileRepository;

    public ProfileService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    @Transactional(readOnly = true)
    public ProfileDto getProfile() {
        return toDto(loadOrCreate());
    }

    @Transactional
    public ProfileDto updateProfile(ProfileUpdateRequest request) {
        UserProfile profile = loadOrCreate();
        profile.setDefaultPortionSize(request.defaultPortionSize());
        profile.setBodyWeightKg(request.bodyWeightKg());
        profile.setBodyHeightCm(request.bodyHeightCm());
        profile.setNutritionTrackingEnabled(request.nutritionTrackingEnabled());
        profile.setCalorieGoal(request.calorieGoal());
        profile.setAge(request.age());
        profile.setSex(request.sex());
        profile.setActivityLevel(request.activityLevel());
        if (request.householdSize() != null) {
            profile.setHouseholdSize(request.householdSize());
        }
        if (request.shoppingTripsPerWeek() != null) {
            profile.setShoppingTripsPerWeek(request.shoppingTripsPerWeek());
        }
        if (request.costTrackingEnabled() != null) {
            profile.setCostTrackingEnabled(request.costTrackingEnabled());
            profile.setWeeklyBudgetEur(request.weeklyBudgetEur());
        }
        return toDto(userProfileRepository.save(profile));
    }

    @Transactional
    public UserProfile loadOrCreate() {
        long householdId = HouseholdContext.currentId();
        return userProfileRepository.findById(householdId)
                .orElseGet(() -> userProfileRepository.save(new UserProfile(householdId)));
    }

    private ProfileDto toDto(UserProfile profile) {
        return new ProfileDto(
                profile.getDefaultPortionSize(),
                profile.getBodyWeightKg(),
                profile.getBodyHeightCm(),
                profile.isNutritionTrackingEnabled(),
                profile.getCalorieGoal(),
                profile.getAge(),
                profile.getSex(),
                profile.getActivityLevel(),
                profile.getHouseholdSize(),
                profile.getShoppingTripsPerWeek(),
                profile.isCostTrackingEnabled(),
                profile.getWeeklyBudgetEur());
    }
}
