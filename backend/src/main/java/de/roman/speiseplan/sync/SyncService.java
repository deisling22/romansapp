package de.roman.speiseplan.sync;

import de.roman.speiseplan.dish.Dish;
import de.roman.speiseplan.dish.DishRepository;
import de.roman.speiseplan.plan.MealPlan;
import de.roman.speiseplan.plan.MealPlanRepository;
import de.roman.speiseplan.plan.PlanEntry;
import de.roman.speiseplan.plan.PlanEntryRepository;
import de.roman.speiseplan.storage.LocalImageStorage;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SyncService {
    private final MealPlanRepository mealPlanRepository;
    private final DishRepository dishRepository;
    private final PlanEntryRepository planEntryRepository;
    private final LocalImageStorage imageStorage;

    public SyncService(
            MealPlanRepository mealPlanRepository,
            DishRepository dishRepository,
            PlanEntryRepository planEntryRepository,
            LocalImageStorage imageStorage) {
        this.mealPlanRepository = mealPlanRepository;
        this.dishRepository = dishRepository;
        this.planEntryRepository = planEntryRepository;
        this.imageStorage = imageStorage;
    }

    @Transactional
    public List<SyncPlanResponse> sync(String ownerEmail, List<SyncPlanRequest> incomingPlans) {
        for (SyncPlanRequest incomingPlan : incomingPlans) {
            MealPlan plan = mealPlanRepository.findByOwnerEmailAndClientId(ownerEmail, incomingPlan.clientId())
                    .orElseGet(() -> mealPlanRepository.save(new MealPlan(
                            incomingPlan.name().trim(), incomingPlan.clientId(), ownerEmail, incomingPlan.updatedAt())));
            if (incomingPlan.updatedAt().isAfter(plan.getUpdatedAt())) {
                plan.updateFromSync(incomingPlan.name().trim(), incomingPlan.updatedAt());
            }
            int sortOrder = 0;
            for (SyncDishRequest incomingDish : incomingPlan.dishes()) {
                Dish dish = upsertDish(ownerEmail, incomingDish);
                if (!planEntryRepository.existsByPlanIdAndDishId(plan.getId(), dish.getId())) {
                    planEntryRepository.save(new PlanEntry(plan, dish, sortOrder));
                }
                sortOrder++;
            }
        }
        return mealPlanRepository.findByOwnerEmailOrderByUpdatedAtAsc(ownerEmail).stream()
                .map(this::toResponse)
                .toList();
    }

    private Dish upsertDish(String ownerEmail, SyncDishRequest incoming) {
        return dishRepository.findByOwnerEmailAndClientId(ownerEmail, incoming.clientId())
                .map(existing -> {
                    if (incoming.updatedAt().isAfter(existing.getUpdatedAt())) {
                        String imageUrl = incoming.imageDataUrl() == null
                                ? null
                                : imageStorage.storeDataUrl(incoming.imageDataUrl());
                        existing.updateFromSync(incoming.name().trim(), imageUrl, incoming.updatedAt());
                    }
                    return existing;
                })
                .orElseGet(() -> {
                    if (incoming.imageDataUrl() == null) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ein neues Gericht benötigt ein Bild.");
                    }
                    String imageUrl = imageStorage.storeDataUrl(incoming.imageDataUrl());
                    return dishRepository.save(new Dish(
                            incoming.name().trim(), imageUrl, incoming.clientId(), ownerEmail, incoming.updatedAt()));
                });
    }

    private SyncPlanResponse toResponse(MealPlan plan) {
        List<SyncDishResponse> dishes = planEntryRepository.findByPlanIdOrderBySortOrderAsc(plan.getId()).stream()
                .map(entry -> entry.getDish())
                .filter(dish -> dish.getClientId() != null)
                .map(dish -> new SyncDishResponse(
                        dish.getId(), dish.getClientId(), dish.getName(), dish.getImageUrl(), dish.getUpdatedAt()))
                .toList();
        return new SyncPlanResponse(plan.getId(), plan.getClientId(), plan.getName(), plan.getUpdatedAt(), dishes);
    }
}