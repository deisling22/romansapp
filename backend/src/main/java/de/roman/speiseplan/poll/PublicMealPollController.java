package de.roman.speiseplan.poll;

import de.roman.speiseplan.poll.MealPollDtos.PublicPoll;
import de.roman.speiseplan.poll.MealPollDtos.VoteRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/meal-polls")
public class PublicMealPollController {
    private final MealPollService service;

    public PublicMealPollController(MealPollService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public PublicPoll get(@PathVariable String id) { return service.publicPoll(id); }

    @PostMapping("/{id}/votes")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void vote(@PathVariable String id, @Valid @RequestBody VoteRequest request) {
        service.vote(id, request);
    }
}
