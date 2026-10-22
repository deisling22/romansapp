package de.roman.speiseplan.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Runs mutating API requests one after another. Cooking, shopping list and pantry updates read
 * and rewrite shared aggregates, so parallel clicks otherwise deadlock or double-book quantities.
 * Holds only within one JVM, which matches the single-instance deployment (render.yaml).
 */
@Component
public class WriteSerializationFilter extends OncePerRequestFilter {
    private static final Set<String> READ_METHODS = Set.of("GET", "HEAD", "OPTIONS");

    private final ReentrantLock lock = new ReentrantLock(true);
    private final long waitMillis;

    public WriteSerializationFilter(@Value("${app.write-lock.wait-millis:8000}") long waitMillis) {
        this.waitMillis = waitMillis;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return READ_METHODS.contains(request.getMethod()) || !request.getRequestURI().startsWith("/api/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        boolean acquired;
        try {
            acquired = lock.tryLock(waitMillis, TimeUnit.MILLISECONDS);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            acquired = false;
        }
        if (!acquired) {
            response.setStatus(HttpStatus.SERVICE_UNAVAILABLE.value());
            response.setHeader("Retry-After", "2");
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(
                    "{\"status\":503,\"message\":\"Der Server ist gerade ausgelastet. Bitte gleich noch einmal versuchen.\"}");
            return;
        }
        try {
            chain.doFilter(request, response);
        } finally {
            lock.unlock();
        }
    }
}
