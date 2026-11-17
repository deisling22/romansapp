package de.roman.speiseplan.poll;

import de.roman.speiseplan.poll.MealPollDtos.ApplyRequest;
import de.roman.speiseplan.poll.MealPollDtos.ManagedPoll;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/meal-polls")
public class MealPollController {
    private final MealPollService service;

    public MealPollController(MealPollService service) {
        this.service = service;
    }

    @GetMapping
    public List<ManagedPoll> list(Principal principal) { return service.list(principal.getName()); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ManagedPoll create(Principal principal) { return service.create(principal.getName()); }

    @GetMapping("/{id}")
    public ManagedPoll manage(@PathVariable String id, Principal principal) {
        return service.manage(id, principal.getName());
    }

    @PostMapping("/{id}/close")
    public ManagedPoll close(@PathVariable String id, Principal principal) {
        return service.close(id, principal.getName());
    }

    @PostMapping("/{id}/apply")
    public ManagedPoll apply(@PathVariable String id, Principal principal, @Valid @RequestBody ApplyRequest request) {
        return service.apply(id, principal.getName(), request.count());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id, Principal principal) { service.delete(id, principal.getName()); }
}
