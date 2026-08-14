package de.roman.speiseplan.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

/**
 * After a successful Google login, issues a signed bearer token carrying the user's profile
 * claims and redirects to the frontend's account page with the token in the URL. The frontend
 * stores the token and sends it as an {@code Authorization: Bearer} header on subsequent API
 * calls, since it cannot rely on the session cookie across the cross-site GitHub Pages / Render
 * domain boundary in browsers that block third-party cookies (e.g. Safari).
 */
public class GoogleOAuth2SuccessHandler implements AuthenticationSuccessHandler {
    private final TokenService tokenService;
    private final String frontendUrl;

    public GoogleOAuth2SuccessHandler(TokenService tokenService, String frontendUrl) {
        this.tokenService = tokenService;
        this.frontendUrl = frontendUrl;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException {
        OAuth2User user = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = user.getAttributes();

        Map<String, String> claims = new LinkedHashMap<>();
        claims.put("name", String.valueOf(attributes.getOrDefault("name", user.getName())));
        claims.put("given_name", String.valueOf(attributes.getOrDefault("given_name", "")));
        claims.put("family_name", String.valueOf(attributes.getOrDefault("family_name", "")));
        claims.put("email", String.valueOf(attributes.getOrDefault("email", "")));
        Object picture = attributes.get("picture");
        claims.put("picture", picture == null ? "" : picture.toString());

        String token = tokenService.issueToken(claims);
        String targetUrl = frontendUrl.replaceAll("/$", "") + "/#/account?token="
                + URLEncoder.encode(token, StandardCharsets.UTF_8);
        response.sendRedirect(targetUrl);
    }
}
