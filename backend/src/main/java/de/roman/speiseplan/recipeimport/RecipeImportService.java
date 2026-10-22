package de.roman.speiseplan.recipeimport;

import java.io.IOException;
import java.io.InputStream;
import java.net.Inet6Address;
import java.net.InetAddress;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.UnknownHostException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Locale;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.ObjectMapper;

/** Fetches a public recipe page server-side (no CORS in the browser) with SSRF protection. */
@Service
public class RecipeImportService {
    private static final int MAX_BYTES = 3 * 1024 * 1024;
    private static final int MAX_IMAGE_BYTES = 8 * 1024 * 1024;
    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of("image/jpeg", "image/png", "image/webp", "image/gif");
    private static final int MAX_REDIRECTS = 4;

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .followRedirects(HttpClient.Redirect.NEVER)
            .build();

    public RecipeImportService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public RecipeImportDto importFrom(String url) {
        URI uri = validate(url);
        String html = new String(fetch(uri, "text/html,application/xhtml+xml", MAX_BYTES).body(), StandardCharsets.UTF_8);
        return RecipeJsonLdParser.parse(html, uri.toString(), objectMapper)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNPROCESSABLE_CONTENT, "Auf dieser Seite wurde kein Rezept gefunden."));
    }

    /** Loads the recipe photo so the browser can attach it to the new dish (remote hosts rarely allow CORS). */
    public FetchedImage fetchImage(String url) {
        Fetched fetched = fetch(validate(url), "image/jpeg,image/png,image/webp,image/gif", MAX_IMAGE_BYTES);
        String contentType = fetched.contentType().toLowerCase(Locale.ROOT);
        if (!ALLOWED_IMAGE_TYPES.contains(contentType)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_CONTENT, "Das Rezeptbild konnte nicht geladen werden.");
        }
        return new FetchedImage(contentType, fetched.body());
    }

    public record FetchedImage(String contentType, byte[] body) {
    }

    private record Fetched(String contentType, byte[] body) {
    }

    private Fetched fetch(URI start, String accept, int maxBytes) {
        URI current = start;
        for (int redirect = 0; redirect <= MAX_REDIRECTS; redirect++) {
            HttpRequest request = HttpRequest.newBuilder(current)
                    .timeout(Duration.ofSeconds(10))
                    .header("User-Agent", "Mozilla/5.0 (compatible; Speiseplan-Rezeptimport/1.0)")
                    .header("Accept", accept)
                    .header("Accept-Language", "de-DE,de;q=0.9,en;q=0.6")
                    .GET()
                    .build();
            HttpResponse<InputStream> response;
            try {
                response = httpClient.send(request, HttpResponse.BodyHandlers.ofInputStream());
            } catch (IOException failed) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Die Seite konnte nicht geladen werden.");
            } catch (InterruptedException interrupted) {
                Thread.currentThread().interrupt();
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Die Seite konnte nicht geladen werden.");
            }
            int status = response.statusCode();
            if (status >= 300 && status < 400) {
                closeQuietly(response.body());
                String location = response.headers().firstValue("Location").orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Ungültige Weiterleitung."));
                current = validate(current.resolve(location).toString());
                continue;
            }
            if (status < 200 || status >= 300) {
                closeQuietly(response.body());
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Die Seite antwortete mit Status " + status + ".");
            }
            String contentType = response.headers().firstValue("Content-Type").orElse("")
                    .split(";", 2)[0].trim();
            try (InputStream body = response.body()) {
                return new Fetched(contentType, body.readNBytes(maxBytes));
            } catch (IOException failed) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Die Seite konnte nicht gelesen werden.");
            }
        }
        throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Zu viele Weiterleitungen.");
    }

    /** Only public http(s) hosts on default ports; private, loopback and link-local targets are rejected. */
    static URI validate(String url) {
        if (url == null || url.isBlank() || url.length() > 2000) {
            throw badUrl();
        }
        URI uri;
        try {
            uri = new URI(url.trim());
        } catch (URISyntaxException invalid) {
            throw badUrl();
        }
        String scheme = uri.getScheme() == null ? "" : uri.getScheme().toLowerCase(Locale.ROOT);
        String host = uri.getHost();
        if (!(scheme.equals("http") || scheme.equals("https")) || host == null || host.isBlank()
                || uri.getUserInfo() != null) {
            throw badUrl();
        }
        int port = uri.getPort();
        if (port != -1 && port != 80 && port != 443) {
            throw badUrl();
        }
        InetAddress[] addresses;
        try {
            addresses = InetAddress.getAllByName(host);
        } catch (UnknownHostException unknown) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Die Adresse konnte nicht gefunden werden.");
        }
        for (InetAddress address : addresses) {
            if (!isPublic(address)) {
                throw badUrl();
            }
        }
        return uri;
    }

    static boolean isPublic(InetAddress address) {
        if (address.isAnyLocalAddress() || address.isLoopbackAddress() || address.isLinkLocalAddress()
                || address.isSiteLocalAddress() || address.isMulticastAddress()) {
            return false;
        }
        byte[] bytes = address.getAddress();
        if (address instanceof Inet6Address) {
            int first = bytes[0] & 0xff;
            if ((first & 0xfe) == 0xfc) {
                return false; // unique local fc00::/7
            }
            boolean ipv4Mapped = true;
            for (int index = 0; index < 10; index++) {
                ipv4Mapped &= bytes[index] == 0;
            }
            if (ipv4Mapped && (bytes[10] & 0xff) == 0xff && (bytes[11] & 0xff) == 0xff) {
                try {
                    return isPublic(InetAddress.getByAddress(new byte[] {bytes[12], bytes[13], bytes[14], bytes[15]}));
                } catch (UnknownHostException impossible) {
                    return false;
                }
            }
            return true;
        }
        int first = bytes[0] & 0xff;
        int second = bytes[1] & 0xff;
        return first != 0
                && !(first == 100 && second >= 64 && second <= 127) // carrier-grade NAT
                && !(first == 169 && second == 254)
                && !(first == 192 && second == 0 && (bytes[2] & 0xff) == 0)
                && !(first == 198 && (second == 18 || second == 19))
                && first < 224;
    }

    private static ResponseStatusException badUrl() {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bitte gib eine öffentliche http(s)-Adresse an.");
    }

    private static void closeQuietly(InputStream body) {
        try {
            body.close();
        } catch (IOException ignored) {
            // nothing to clean up
        }
    }
}
