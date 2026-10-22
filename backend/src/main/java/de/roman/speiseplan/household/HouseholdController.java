package de.roman.speiseplan.household;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.security.Principal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/household")
public class HouseholdController {
    private final HouseholdService householdService;

    public HouseholdController(HouseholdService householdService) {
        this.householdService = householdService;
    }

    @GetMapping
    public HouseholdDto get(Principal principal) {
        return householdService.getOverview(principal == null ? null : principal.getName());
    }

    @PutMapping
    public HouseholdDto rename(Principal principal, @Valid @RequestBody RenameRequest request) {
        return householdService.rename(principal.getName(), request.name());
    }

    @PostMapping("/invite")
    public HouseholdDto invite(Principal principal) {
        return householdService.regenerateInviteCode(principal.getName());
    }

    @PostMapping("/join")
    public HouseholdDto join(Principal principal, @Valid @RequestBody JoinRequest request) {
        return householdService.join(principal.getName(), request.code());
    }

    @PostMapping("/claim-default")
    public HouseholdDto claimDefault(Principal principal) {
        return householdService.claimDefault(principal.getName());
    }

    @PostMapping("/leave")
    public HouseholdDto leave(Principal principal) {
        return householdService.leave(principal.getName());
    }

    @DeleteMapping("/members/{email}")
    public HouseholdDto removeMember(Principal principal, @PathVariable String email) {
        return householdService.removeMember(principal.getName(), email);
    }

    public record RenameRequest(@NotBlank @Size(max = 120) String name) {
    }

    public record JoinRequest(@NotBlank @Size(max = 16) String code) {
    }
}
