package de.roman.speiseplan.creator;

import de.roman.speiseplan.plan.MealPlanRepository;
import de.roman.speiseplan.plan.PlanEntryRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CreatorSubscriptionService {
    private final CreatorRepository creatorRepository;
    private final CreatorSubscriptionRepository subscriptionRepository;
    private final MealPlanRepository mealPlanRepository;
    private final PlanEntryRepository planEntryRepository;

    public CreatorSubscriptionService(
            CreatorRepository creatorRepository,
            CreatorSubscriptionRepository subscriptionRepository,
            MealPlanRepository mealPlanRepository,
            PlanEntryRepository planEntryRepository) {
        this.creatorRepository = creatorRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.mealPlanRepository = mealPlanRepository;
        this.planEntryRepository = planEntryRepository;
    }

    @Transactional(readOnly = true)
    public boolean isSubscribed(String ownerEmail, Long creatorId) {
        return subscriptionRepository.findByOwnerEmailAndCreatorId(ownerEmail, creatorId).isPresent();
    }

    @Transactional
    public void subscribe(String ownerEmail, Long creatorId) {
        if (subscriptionRepository.findByOwnerEmailAndCreatorId(ownerEmail, creatorId).isPresent()) {
            return;
        }
        Creator creator = creatorRepository.findById(creatorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Creator wurde nicht gefunden."));
        subscriptionRepository.save(new CreatorSubscription(ownerEmail, creator));
    }

    @Transactional
    public void unsubscribe(String ownerEmail, Long creatorId) {
        subscriptionRepository.deleteByOwnerEmailAndCreatorId(ownerEmail, creatorId);
    }

    @Transactional
    public List<CreatorNotificationDto> poll(String ownerEmail) {
        Instant checkedAt = Instant.now();
        return subscriptionRepository.findByOwnerEmail(ownerEmail).stream()
                .map(subscription -> {
                    Creator creator = subscription.getCreator();
                    long plans = mealPlanRepository.countByCreatorIdAndCreatedAtAfter(
                            creator.getId(), subscription.getLastCheckedAt());
                    long dishes = planEntryRepository.countByPlanCreatorIdAndCreatedAtAfter(
                            creator.getId(), subscription.getLastCheckedAt());
                    subscription.markChecked(checkedAt);
                    return new CreatorNotificationDto(creator.getId(), creator.getName(), plans, dishes);
                })
                .filter(notification -> notification.newPlanCount() > 0 || notification.newDishCount() > 0)
                .toList();
    }
}