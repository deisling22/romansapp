package de.roman.speiseplan.recipeimport;

import java.time.Duration;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/** Extracts a schema.org Recipe from the JSON-LD blocks that most recipe sites embed. */
public final class RecipeJsonLdParser {
    private static final Pattern JSON_LD = Pattern.compile(
            "<script[^>]*type\\s*=\\s*[\"']application/ld\\+json[\"'][^>]*>(.*?)</script>",
            Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
    private static final Pattern META_IMAGE = Pattern.compile(
            "<meta\\b[^>]*(?:property|name)\\s*=\\s*[\"'](?:og:image|og:image:url|twitter:image)[\"'][^>]*>",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern META_CONTENT = Pattern.compile(
            "\\bcontent\\s*=\\s*([\"'])(.*?)\\1", Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
    private static final Pattern FIRST_NUMBER = Pattern.compile("(\\d+)");
    private static final Pattern TAGS = Pattern.compile("<[^>]+>");
    private static final int MAX_ITEMS = 80;

    private RecipeJsonLdParser() {
    }

    public static Optional<RecipeImportDto> parse(String html, String sourceUrl, ObjectMapper objectMapper) {
        List<JsonNode> roots = new ArrayList<>();
        Matcher matcher = JSON_LD.matcher(html);
        while (matcher.find()) {
            try {
                roots.add(objectMapper.readTree(matcher.group(1).trim()));
            } catch (JacksonException invalidBlock) {
                // Skip malformed blocks; other blocks on the page may still contain the recipe.
            }
        }
        Map<String, JsonNode> nodesById = new HashMap<>();
        roots.forEach(root -> indexIds(root, nodesById, 0));
        for (JsonNode root : roots) {
            Optional<JsonNode> recipe = findRecipe(root, 0);
            if (recipe.isPresent()) {
                return Optional.of(toDto(recipe.get(), sourceUrl, nodesById, html));
            }
        }
        return Optional.empty();
    }

    /** Collects nodes carrying an {@code @id} so references like {@code "image":{"@id":"…#primaryimage"}} can be resolved. */
    private static void indexIds(JsonNode node, Map<String, JsonNode> nodesById, int depth) {
        if (node == null || depth > 6) {
            return;
        }
        if (node.isArray()) {
            for (JsonNode item : node) {
                indexIds(item, nodesById, depth + 1);
            }
            return;
        }
        if (!node.isObject()) {
            return;
        }
        String id = text(node.get("@id"));
        if (id != null && node.size() > 1) {
            nodesById.putIfAbsent(id, node);
        }
        indexIds(node.get("@graph"), nodesById, depth + 1);
    }

    private static Optional<JsonNode> findRecipe(JsonNode node, int depth) {
        if (node == null || depth > 6) {
            return Optional.empty();
        }
        if (node.isArray()) {
            for (JsonNode item : node) {
                Optional<JsonNode> found = findRecipe(item, depth + 1);
                if (found.isPresent()) {
                    return found;
                }
            }
            return Optional.empty();
        }
        if (!node.isObject()) {
            return Optional.empty();
        }
        if (isRecipeType(node.get("@type"))) {
            return Optional.of(node);
        }
        Optional<JsonNode> inGraph = findRecipe(node.get("@graph"), depth + 1);
        return inGraph.isPresent() ? inGraph : findRecipe(node.get("mainEntity"), depth + 1);
    }

    private static boolean isRecipeType(JsonNode type) {
        if (type == null) {
            return false;
        }
        if (type.isArray()) {
            for (JsonNode item : type) {
                if ("Recipe".equalsIgnoreCase(text(item))) {
                    return true;
                }
            }
            return false;
        }
        return "Recipe".equalsIgnoreCase(text(type));
    }

    private static RecipeImportDto toDto(JsonNode recipe, String sourceUrl, Map<String, JsonNode> nodesById, String html) {
        String imageUrl = image(recipe.get("image"), nodesById, 0);
        if (imageUrl == null) {
            imageUrl = metaImage(html);
        }
        String name = clean(text(recipe.get("name")));
        Integer minutes = minutes(recipe.get("totalTime"));
        if (minutes == null) {
            Integer prep = minutes(recipe.get("prepTime"));
            Integer cook = minutes(recipe.get("cookTime"));
            minutes = prep == null && cook == null ? null : (prep == null ? 0 : prep) + (cook == null ? 0 : cook);
        }
        List<String> steps = new ArrayList<>();
        collectSteps(recipe.get("recipeInstructions"), steps, 0);
        return new RecipeImportDto(
                name == null || name.isBlank() ? "Importiertes Rezept" : truncate(name, 120),
                truncate(clean(text(recipe.get("description"))), 2000),
                imageUrl,
                servings(recipe.get("recipeYield")),
                minutes == null || minutes <= 0 ? null : minutes,
                strings(recipe.get("recipeIngredient")),
                steps,
                tags(recipe),
                sourceUrl);
    }

    private static List<String> strings(JsonNode node) {
        List<String> values = new ArrayList<>();
        if (node == null) {
            return values;
        }
        if (node.isArray()) {
            for (JsonNode item : node) {
                String value = clean(text(item));
                if (value != null && !value.isBlank() && values.size() < MAX_ITEMS) {
                    values.add(truncate(value, 300));
                }
            }
        } else {
            String value = clean(text(node));
            if (value != null && !value.isBlank()) {
                values.add(truncate(value, 300));
            }
        }
        return values;
    }

    private static void collectSteps(JsonNode node, List<String> steps, int depth) {
        if (node == null || depth > 4 || steps.size() >= MAX_ITEMS) {
            return;
        }
        if (node.isArray()) {
            for (JsonNode item : node) {
                collectSteps(item, steps, depth + 1);
            }
            return;
        }
        if (node.isObject()) {
            if (node.has("itemListElement")) {
                collectSteps(node.get("itemListElement"), steps, depth + 1);
                return;
            }
            String text = clean(text(node.get("text")));
            if (text == null) {
                text = clean(text(node.get("name")));
            }
            addStep(steps, text);
            return;
        }
        String text = clean(text(node));
        if (text != null && text.contains("\n")) {
            for (String line : text.split("\\n+")) {
                addStep(steps, line);
            }
        } else {
            addStep(steps, text);
        }
    }

    private static void addStep(List<String> steps, String text) {
        if (text != null && !text.isBlank() && steps.size() < MAX_ITEMS) {
            steps.add(truncate(text.trim(), 1000));
        }
    }

    private static List<String> tags(JsonNode recipe) {
        Set<String> tags = new LinkedHashSet<>();
        for (String field : List.of("recipeCategory", "recipeCuisine", "keywords")) {
            JsonNode node = recipe.get(field);
            List<String> raw = node != null && node.isArray() ? strings(node) : List.of(String.valueOf(text(node)));
            for (String value : raw) {
                if ("null".equals(value)) {
                    continue;
                }
                for (String tag : value.split(",")) {
                    String trimmed = clean(tag);
                    if (trimmed != null && !trimmed.isBlank() && trimmed.length() <= 30 && tags.size() < 8) {
                        tags.add(trimmed.toLowerCase());
                    }
                }
            }
        }
        return List.copyOf(tags);
    }

    private static String image(JsonNode node, Map<String, JsonNode> nodesById, int depth) {
        if (node == null || depth > 3) {
            return null;
        }
        if (node.isArray()) {
            for (JsonNode item : node) {
                String url = image(item, nodesById, depth + 1);
                if (url != null) {
                    return url;
                }
            }
            return null;
        }
        if (node.isObject()) {
            String url = imageUrl(text(node.get("url")));
            if (url == null) {
                url = imageUrl(text(node.get("contentUrl")));
            }
            if (url == null) {
                JsonNode referenced = nodesById.get(text(node.get("@id")));
                if (referenced != null && referenced != node) {
                    url = image(referenced, nodesById, depth + 1);
                }
            }
            return url;
        }
        return imageUrl(text(node));
    }

    private static String metaImage(String html) {
        Matcher tag = META_IMAGE.matcher(html);
        while (tag.find()) {
            Matcher content = META_CONTENT.matcher(tag.group());
            if (content.find()) {
                String url = imageUrl(clean(content.group(2)));
                if (url != null) {
                    return url;
                }
            }
        }
        return null;
    }

    private static String imageUrl(String url) {
        return url != null && (url.startsWith("https://") || url.startsWith("http://")) && url.length() <= 255 ? url : null;
    }

    private static Integer servings(JsonNode node) {
        if (node == null) {
            return null;
        }
        JsonNode first = node.isArray() ? (node.isEmpty() ? null : node.get(0)) : node;
        String value = text(first);
        if (value == null) {
            return null;
        }
        Matcher matcher = FIRST_NUMBER.matcher(value);
        if (!matcher.find()) {
            return null;
        }
        int servings = Integer.parseInt(matcher.group(1).length() > 3 ? "0" : matcher.group(1));
        return servings >= 1 && servings <= 50 ? servings : null;
    }

    private static Integer minutes(JsonNode node) {
        String value = text(node);
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            long minutes = Duration.parse(value.trim()).toMinutes();
            return minutes > 0 && minutes < 10_000 ? (int) minutes : null;
        } catch (DateTimeParseException invalid) {
            return null;
        }
    }

    private static String text(JsonNode node) {
        if (node == null || node.isNull()) {
            return null;
        }
        if (node.isString()) {
            return node.stringValue();
        }
        if (node.isNumber() || node.isBoolean()) {
            return node.asString();
        }
        return null;
    }

    static String clean(String value) {
        if (value == null) {
            return null;
        }
        String withoutTags = TAGS.matcher(value).replaceAll(" ");
        return withoutTags
                .replace("&nbsp;", " ")
                .replace("&amp;", "&")
                .replace("&quot;", "\"")
                .replace("&#39;", "'")
                .replace("&apos;", "'")
                .replace("&lt;", "<")
                .replace("&gt;", ">")
                .replaceAll("[ \\t\\x0B\\f\\r]+", " ")
                .trim();
    }

    private static String truncate(String value, int max) {
        if (value == null) {
            return null;
        }
        return value.length() <= max ? value : value.substring(0, max);
    }
}
