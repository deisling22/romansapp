package de.roman.speiseplan.household;

import java.util.List;

public record HouseholdDto(
        Long id,
        String name,
        boolean guest,
        boolean authenticated,
        String role,
        String inviteCode,
        List<MemberDto> members,
        boolean defaultClaimable) {

    public record MemberDto(String email, String role, boolean you) {
    }
}
