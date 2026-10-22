package de.roman.speiseplan.household;

import java.security.SecureRandom;
import java.util.List;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class HouseholdService {
    private static final String INVITE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int INVITE_LENGTH = 8;
    private static final String DEFAULT_NAME = "Mein Haushalt";

    private final HouseholdRepository householdRepository;
    private final HouseholdMemberRepository memberRepository;
    private final SecureRandom random = new SecureRandom();

    public HouseholdService(HouseholdRepository householdRepository, HouseholdMemberRepository memberRepository) {
        this.householdRepository = householdRepository;
        this.memberRepository = memberRepository;
    }

    /**
     * Anonymous visitors share the default household until a signed-in user claims it; afterwards they land
     * in a shared guest household. Signed-in users get their own household on first contact.
     */
    @Transactional
    public long resolveHouseholdId(String email) {
        String normalized = normalize(email);
        if (normalized == null) {
            if (memberRepository.countByHouseholdId(HouseholdContext.DEFAULT_HOUSEHOLD_ID) == 0) {
                return HouseholdContext.DEFAULT_HOUSEHOLD_ID;
            }
            return householdRepository.findFirstByGuestTrueOrderByIdAsc()
                    .orElseGet(() -> householdRepository.save(new Household("Gast", true)))
                    .getId();
        }
        return memberRepository.findById(normalized)
                .map(HouseholdMember::getHouseholdId)
                .orElseGet(() -> {
                    Household household = householdRepository.save(new Household(DEFAULT_NAME, false));
                    memberRepository.save(new HouseholdMember(normalized, household.getId(), HouseholdMember.Role.OWNER));
                    return household.getId();
                });
    }

    @Transactional(readOnly = true)
    public HouseholdDto getOverview(String email) {
        String normalized = normalize(email);
        long householdId = HouseholdContext.currentId();
        Household household = requireHousehold(householdId);
        HouseholdMember self = normalized == null ? null : memberRepository.findById(normalized).orElse(null);
        boolean member = self != null && self.getHouseholdId().equals(householdId);
        List<HouseholdDto.MemberDto> members = member
                ? memberRepository.findByHouseholdIdOrderByJoinedAtAsc(householdId).stream()
                        .map(m -> new HouseholdDto.MemberDto(m.getEmail(), m.getRole().name(), m.getEmail().equals(normalized)))
                        .toList()
                : List.of();
        boolean defaultClaimable = normalized != null
                && householdId != HouseholdContext.DEFAULT_HOUSEHOLD_ID
                && memberRepository.countByHouseholdId(HouseholdContext.DEFAULT_HOUSEHOLD_ID) == 0;
        return new HouseholdDto(
                household.getId(),
                household.getName(),
                household.isGuest(),
                normalized != null,
                member ? self.getRole().name() : null,
                member ? household.getInviteCode() : null,
                members,
                defaultClaimable);
    }

    @Transactional
    public HouseholdDto rename(String email, String name) {
        HouseholdMember self = requireMember(email);
        requireHousehold(self.getHouseholdId()).setName(name.trim());
        return overviewFor(self);
    }

    @Transactional
    public HouseholdDto regenerateInviteCode(String email) {
        HouseholdMember self = requireMember(email);
        Household household = requireHousehold(self.getHouseholdId());
        String code;
        do {
            code = randomCode();
        } while (householdRepository.findByInviteCode(code).isPresent());
        household.setInviteCode(code);
        return overviewFor(self);
    }

    @Transactional
    public HouseholdDto join(String email, String code) {
        HouseholdMember self = requireMember(email);
        String normalizedCode = code == null ? "" : code.trim().toUpperCase(Locale.ROOT);
        Household target = householdRepository.findByInviteCode(normalizedCode)
                .filter(household -> !household.isGuest())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Einladungscode ist ungültig."));
        if (target.getId().equals(self.getHouseholdId())) {
            return overviewFor(self);
        }
        Long previous = self.getHouseholdId();
        self.moveTo(target.getId(), HouseholdMember.Role.MEMBER);
        memberRepository.flush();
        handOverOwnership(previous);
        return overviewFor(self);
    }

    /** Lets a signed-in user take over the data that was created before anyone signed in. */
    @Transactional
    public HouseholdDto claimDefault(String email) {
        HouseholdMember self = requireMember(email);
        if (memberRepository.countByHouseholdId(HouseholdContext.DEFAULT_HOUSEHOLD_ID) > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Dieser Haushalt gehört bereits jemandem.");
        }
        Long previous = self.getHouseholdId();
        self.moveTo(HouseholdContext.DEFAULT_HOUSEHOLD_ID, HouseholdMember.Role.OWNER);
        memberRepository.flush();
        handOverOwnership(previous);
        return overviewFor(self);
    }

    @Transactional
    public HouseholdDto leave(String email) {
        HouseholdMember self = requireMember(email);
        Long previous = self.getHouseholdId();
        if (memberRepository.countByHouseholdId(previous) <= 1) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Du bist das einzige Mitglied dieses Haushalts.");
        }
        Household fresh = householdRepository.save(new Household(DEFAULT_NAME, false));
        self.moveTo(fresh.getId(), HouseholdMember.Role.OWNER);
        memberRepository.flush();
        handOverOwnership(previous);
        return overviewFor(self);
    }

    @Transactional
    public HouseholdDto removeMember(String email, String memberEmail) {
        HouseholdMember self = requireMember(email);
        if (self.getRole() != HouseholdMember.Role.OWNER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Nur der Besitzer kann Mitglieder entfernen.");
        }
        String normalizedMember = normalize(memberEmail);
        HouseholdMember other = normalizedMember == null ? null : memberRepository.findById(normalizedMember).orElse(null);
        if (other == null || !other.getHouseholdId().equals(self.getHouseholdId()) || other.getEmail().equals(self.getEmail())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mitglied wurde nicht gefunden.");
        }
        Household fresh = householdRepository.save(new Household(DEFAULT_NAME, false));
        other.moveTo(fresh.getId(), HouseholdMember.Role.OWNER);
        return overviewFor(self);
    }

    private void handOverOwnership(Long householdId) {
        List<HouseholdMember> remaining = memberRepository.findByHouseholdIdOrderByJoinedAtAsc(householdId);
        if (!remaining.isEmpty() && remaining.stream().noneMatch(m -> m.getRole() == HouseholdMember.Role.OWNER)) {
            remaining.get(0).setRole(HouseholdMember.Role.OWNER);
        }
    }

    private HouseholdDto overviewFor(HouseholdMember self) {
        HouseholdContext.set(self.getHouseholdId());
        return getOverview(self.getEmail());
    }

    private HouseholdMember requireMember(String email) {
        String normalized = normalize(email);
        if (normalized == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Bitte melde dich an.");
        }
        return memberRepository.findById(normalized).orElseGet(() -> {
            resolveHouseholdId(normalized);
            return memberRepository.findById(normalized).orElseThrow();
        });
    }

    private Household requireHousehold(long householdId) {
        return householdRepository.findById(householdId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Haushalt wurde nicht gefunden."));
    }

    private String randomCode() {
        StringBuilder code = new StringBuilder(INVITE_LENGTH);
        for (int index = 0; index < INVITE_LENGTH; index++) {
            code.append(INVITE_ALPHABET.charAt(random.nextInt(INVITE_ALPHABET.length())));
        }
        return code.toString();
    }

    static String normalize(String email) {
        if (email == null || email.isBlank()) {
            return null;
        }
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
