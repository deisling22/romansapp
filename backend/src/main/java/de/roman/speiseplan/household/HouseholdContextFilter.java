package de.roman.speiseplan.household;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

/** Binds the household of the signed-in user (or the anonymous fallback) to the request thread. */
public class HouseholdContextFilter extends OncePerRequestFilter {
    private final HouseholdService householdService;

    public HouseholdContextFilter(HouseholdService householdService) {
        this.householdService = householdService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String email = currentEmail();
        long householdId;
        try {
            householdId = householdService.resolveHouseholdId(email);
        } catch (DataIntegrityViolationException concurrentFirstRequest) {
            householdId = householdService.resolveHouseholdId(email);
        }
        HouseholdContext.set(householdId);
        try {
            chain.doFilter(request, response);
        } finally {
            HouseholdContext.clear();
        }
    }

    private static String currentEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            return null;
        }
        return authentication.getName();
    }
}
