package de.roman.speiseplan.profile;

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
        return toDto(userProfileRepository.save(profile));
    }

    @Transactional
    public UserProfile loadOrCreate() {
        return userProfileRepository.findById(UserProfile.SINGLETON_ID)
                .orElseGet(() -> userProfileRepository.save(new UserProfile()));
    }

    private ProfileDto toDto(UserProfile profile) {
        return new ProfileDto(profile.getDefaultPortionSize(), profile.getBodyWeightKg(), profile.getBodyHeightCm());
    }
}
