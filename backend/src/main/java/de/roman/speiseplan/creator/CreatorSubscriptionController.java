package de.roman.speiseplan.creator;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/creator-subscriptions")
public class CreatorSubscriptionController {
    private final CreatorSubscriptionService subscriptionService;

    public CreatorSubscriptionController(CreatorSubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @GetMapping("/{creatorId}")
    public Map<String, Boolean> getStatus(Principal principal, @PathVariable Long creatorId) {
        return Map.of("subscribed", subscriptionService.isSubscribed(principal.getName(), creatorId));
    }

    @PostMapping("/{creatorId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void subscribe(Principal principal, @PathVariable Long creatorId) {
        subscriptionService.subscribe(principal.getName(), creatorId);
    }

    @DeleteMapping("/{creatorId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unsubscribe(Principal principal, @PathVariable Long creatorId) {
        subscriptionService.unsubscribe(principal.getName(), creatorId);
    }

    @GetMapping("/notifications")
    public List<CreatorNotificationDto> pollNotifications(Principal principal) {
        return subscriptionService.poll(principal.getName());
    }
}