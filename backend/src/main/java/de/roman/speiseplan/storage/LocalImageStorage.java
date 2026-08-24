package de.roman.speiseplan.storage;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class LocalImageStorage {
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;
    private static final Map<String, String> EXTENSIONS = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp");

    private final Path uploadDirectory;

    public LocalImageStorage(@Value("${app.storage.upload-dir:uploads}") String uploadDirectory) {
        this.uploadDirectory = Path.of(uploadDirectory).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadDirectory);
        } catch (IOException exception) {
            throw new IllegalStateException("Upload-Verzeichnis konnte nicht erstellt werden.", exception);
        }
    }

    public String store(MultipartFile image) {
        String contentType = image.getContentType();
        String extension = EXTENSIONS.get(contentType);
        if (image.isEmpty() || extension == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Bitte lade ein JPEG-, PNG- oder WebP-Bild hoch.");
        }
        if (image.getSize() > MAX_FILE_SIZE) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE,
                    "Das Bild darf maximal 10 MB groß sein.");
        }

        String filename = UUID.randomUUID() + extension;
        Path target = uploadDirectory.resolve(filename);
        try (InputStream inputStream = image.getInputStream()) {
            Files.copy(inputStream, target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Das Bild konnte nicht gespeichert werden.", exception);
        }
        return "/uploads/" + filename;
    }

    public String storeDataUrl(String dataUrl) {
        int separator = dataUrl.indexOf(',');
        if (separator < 0 || !dataUrl.startsWith("data:")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Das Bildformat ist ungültig.");
        }
        String contentType = dataUrl.substring(5, dataUrl.indexOf(';'));
        String extension = EXTENSIONS.get(contentType);
        if (extension == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bitte verwende ein JPEG-, PNG- oder WebP-Bild.");
        }
        byte[] bytes;
        try {
            bytes = Base64.getDecoder().decode(dataUrl.substring(separator + 1));
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Das Bildformat ist ungültig.", exception);
        }
        if (bytes.length == 0 || bytes.length > MAX_FILE_SIZE) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "Das Bild darf maximal 10 MB groß sein.");
        }
        String filename = UUID.randomUUID() + extension;
        try {
            Files.write(uploadDirectory.resolve(filename), bytes);
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Das Bild konnte nicht gespeichert werden.", exception);
        }
        return "/uploads/" + filename;
    }
}