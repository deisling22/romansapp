package de.roman.speiseplan.config;

import java.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;

@Configuration
public class SecurityConfig {
    private final boolean googleOAuthEnabled;
    private final String frontendUrl;

    public SecurityConfig(
            @Value("${app.security.google-oauth-enabled:false}") boolean googleOAuthEnabled,
            @Value("${app.frontend-url:http://localhost:4200}") String frontendUrl) {
        this.googleOAuthEnabled = googleOAuthEnabled;
        this.frontendUrl = frontendUrl;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.ignoringRequestMatchers("/api/**"))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/auth/**").authenticated()
                        .anyRequest().permitAll())
                .exceptionHandling(exceptions -> exceptions.defaultAuthenticationEntryPointFor(
                        new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
                    request -> request.getRequestURI().startsWith("/api/")));

        if (googleOAuthEnabled) {
            http.oauth2Login(oauth2 -> oauth2.successHandler(authenticationSuccessHandler()));
        }

        return http.build();
    }

    private SimpleUrlAuthenticationSuccessHandler authenticationSuccessHandler() {
        String targetUrl = frontendUrl.replaceAll("/$", "") + "/#/account";
        return new SimpleUrlAuthenticationSuccessHandler(targetUrl);
    }
}