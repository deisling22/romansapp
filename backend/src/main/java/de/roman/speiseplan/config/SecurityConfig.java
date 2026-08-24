package de.roman.speiseplan.config;

import de.roman.speiseplan.auth.BearerTokenAuthenticationFilter;
import de.roman.speiseplan.auth.GoogleOAuth2SuccessHandler;
import de.roman.speiseplan.auth.TokenService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
    private final boolean googleOAuthEnabled;
    private final String frontendUrl;
    private final TokenService tokenService;

    public SecurityConfig(
            @Value("${app.security.google-oauth-enabled:false}") boolean googleOAuthEnabled,
            @Value("${app.frontend-url:http://localhost:4200}") String frontendUrl,
            TokenService tokenService) {
        this.googleOAuthEnabled = googleOAuthEnabled;
        this.frontendUrl = frontendUrl;
        this.tokenService = tokenService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.ignoringRequestMatchers("/api/**"))
                .addFilterBefore(
                        new BearerTokenAuthenticationFilter(tokenService), UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/auth/**").authenticated()
                        .requestMatchers("/api/sync/**").authenticated()
                        .requestMatchers("/api/creator-subscriptions/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/dishes/*/ratings").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/dishes/*/favorite").authenticated()
                        .anyRequest().permitAll())
                .exceptionHandling(exceptions -> exceptions.defaultAuthenticationEntryPointFor(
                        new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
                    request -> request.getRequestURI().startsWith("/api/")));

        if (googleOAuthEnabled) {
            http.oauth2Login(oauth2 -> oauth2.successHandler(new GoogleOAuth2SuccessHandler(tokenService, frontendUrl)));
        }

        return http.build();
    }
}