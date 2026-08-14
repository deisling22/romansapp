package de.roman.speiseplan.auth;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Issues and validates signed, stateless bearer tokens carrying the Google profile claims of an
 * authenticated user. Used instead of relying solely on the session cookie because the frontend
 * (GitHub Pages) and backend (Render) live on different domains, and browsers such as Safari block
 * cross-site cookies by default (Intelligent Tracking Prevention), even with SameSite=None.
 */
@Service
public class TokenService {
    private static final String HMAC_ALGORITHM = "HmacSHA256";
    private static final long TOKEN_TTL_DAYS = 30;

    private final byte[] secretKeyBytes;

    public TokenService(@Value("${app.security.token-secret}") String secret) {
        this.secretKeyBytes = secret.getBytes(StandardCharsets.UTF_8);
    }

    public String issueToken(Map<String, String> claims) {
        Map<String, String> withExpiry = new LinkedHashMap<>(claims);
        withExpiry.put("exp", String.valueOf(Instant.now().plus(TOKEN_TTL_DAYS, ChronoUnit.DAYS).getEpochSecond()));
        byte[] payloadBytes = serialize(withExpiry).getBytes(StandardCharsets.UTF_8);
        String payload = Base64.getUrlEncoder().withoutPadding().encodeToString(payloadBytes);
        String signature = Base64.getUrlEncoder().withoutPadding().encodeToString(hmac(payloadBytes));
        return payload + "." + signature;
    }

    public Optional<Map<String, String>> parseToken(String token) {
        int separatorIndex = token.indexOf('.');
        if (separatorIndex < 0) {
            return Optional.empty();
        }
        byte[] payloadBytes;
        byte[] providedSignature;
        try {
            payloadBytes = Base64.getUrlDecoder().decode(token.substring(0, separatorIndex));
            providedSignature = Base64.getUrlDecoder().decode(token.substring(separatorIndex + 1));
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
        if (!MessageDigest.isEqual(hmac(payloadBytes), providedSignature)) {
            return Optional.empty();
        }
        Map<String, String> claims = deserialize(new String(payloadBytes, StandardCharsets.UTF_8));
        String expiresAt = claims.get("exp");
        if (expiresAt == null || Instant.now().getEpochSecond() > Long.parseLong(expiresAt)) {
            return Optional.empty();
        }
        return Optional.of(claims);
    }

    private byte[] hmac(byte[] data) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(new SecretKeySpec(secretKeyBytes, HMAC_ALGORITHM));
            return mac.doFinal(data);
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException("Unable to compute token signature", e);
        }
    }

    private static String serialize(Map<String, String> claims) {
        return claims.entrySet().stream()
                .map(entry -> URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8) + "="
                        + URLEncoder.encode(entry.getValue() == null ? "" : entry.getValue(), StandardCharsets.UTF_8))
                .collect(Collectors.joining("&"));
    }

    private static Map<String, String> deserialize(String payload) {
        Map<String, String> claims = new LinkedHashMap<>();
        for (String pair : payload.split("&")) {
            if (pair.isEmpty()) {
                continue;
            }
            int equalsIndex = pair.indexOf('=');
            String key = URLDecoder.decode(
                    equalsIndex < 0 ? pair : pair.substring(0, equalsIndex), StandardCharsets.UTF_8);
            String value = equalsIndex < 0
                    ? ""
                    : URLDecoder.decode(pair.substring(equalsIndex + 1), StandardCharsets.UTF_8);
            claims.put(key, value);
        }
        return claims;
    }
}
