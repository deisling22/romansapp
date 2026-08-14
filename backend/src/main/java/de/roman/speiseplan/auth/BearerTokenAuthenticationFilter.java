package de.roman.speiseplan.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Authenticates requests carrying an {@code Authorization: Bearer <token>} header issued by
 * {@link GoogleOAuth2SuccessHandler}. This lets the frontend stay authenticated even when the
 * browser refuses to send the session cookie across the GitHub Pages / Render domain boundary.
 */
public class BearerTokenAuthenticationFilter extends OncePerRequestFilter {
    private static final String BEARER_PREFIX = "Bearer ";

    private final TokenService tokenService;

    public BearerTokenAuthenticationFilter(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null
                && header.startsWith(BEARER_PREFIX)
                && SecurityContextHolder.getContext().getAuthentication() == null) {
            tokenService.parseToken(header.substring(BEARER_PREFIX.length())).ifPresent(claims -> {
                Map<String, Object> attributes = new LinkedHashMap<>(claims);
                List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
                OAuth2User oauth2User = new DefaultOAuth2User(authorities, attributes, "email");
                SecurityContextHolder.getContext()
                        .setAuthentication(new OAuth2AuthenticationToken(oauth2User, authorities, "google"));
            });
        }
        filterChain.doFilter(request, response);
    }
}
