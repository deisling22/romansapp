package de.roman.speiseplan.recipeimport;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.net.InetAddress;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.json.JsonMapper;

class RecipeImportTest {
    private final JsonMapper mapper = JsonMapper.builder().build();

    @Test
    void parsesRecipeFromJsonLdGraph() {
        String html = """
                <html><head>
                <script type="application/ld+json">{"@type":"WebSite","name":"Kochseite"}</script>
                <script type="application/ld+json">
                {"@context":"https://schema.org","@graph":[
                  {"@type":"BreadcrumbList"},
                  {"@type":["Recipe"],"name":"Käse &amp; Spätzle","description":"<p>Lecker</p>",
                   "image":[{"@type":"ImageObject","url":"https://img.example.com/s.jpg"}],
                   "recipeYield":["4 Portionen"],"prepTime":"PT15M","cookTime":"PT20M",
                   "recipeIngredient":["500 g Spätzle","200 g Bergkäse"],
                   "recipeInstructions":[{"@type":"HowToSection","itemListElement":[
                      {"@type":"HowToStep","text":"Spätzle kochen."},
                      {"@type":"HowToStep","text":"Mit Käse schichten."}]}],
                   "keywords":"Hauptgericht, Vegetarisch"}
                ]}
                </script></head></html>
                """;

        RecipeImportDto recipe = RecipeJsonLdParser.parse(html, "https://example.com/r", mapper).orElseThrow();

        assertThat(recipe.name()).isEqualTo("Käse & Spätzle");
        assertThat(recipe.description()).isEqualTo("Lecker");
        assertThat(recipe.imageUrl()).isEqualTo("https://img.example.com/s.jpg");
        assertThat(recipe.servings()).isEqualTo(4);
        assertThat(recipe.prepMinutes()).isEqualTo(35);
        assertThat(recipe.ingredients()).containsExactly("500 g Spätzle", "200 g Bergkäse");
        assertThat(recipe.steps()).containsExactly("Spätzle kochen.", "Mit Käse schichten.");
        assertThat(recipe.tags()).containsExactly("hauptgericht", "vegetarisch");
    }

    @Test
    void resolvesImageReferencedByIdInGraph() {
        String html = """
                <script type="application/ld+json">
                {"@context":"https://schema.org","@graph":[
                  {"@type":"Recipe","name":"Apfelkuchen","image":{"@id":"https://example.com/r#primaryimage"}},
                  {"@type":"ImageObject","@id":"https://example.com/r#primaryimage",
                   "contentUrl":"https://img.example.com/apfel.jpg"}
                ]}
                </script>
                """;

        RecipeImportDto recipe = RecipeJsonLdParser.parse(html, "https://example.com/r", mapper).orElseThrow();

        assertThat(recipe.imageUrl()).isEqualTo("https://img.example.com/apfel.jpg");
    }

    @Test
    void fallsBackToOpenGraphImage() {
        String html = """
                <html><head>
                <meta content="https://img.example.com/og.jpg?w=960&amp;h=540" property="og:image">
                <script type="application/ld+json">{"@type":"Recipe","name":"Suppe"}</script>
                </head></html>
                """;

        RecipeImportDto recipe = RecipeJsonLdParser.parse(html, "https://example.com/r", mapper).orElseThrow();

        assertThat(recipe.imageUrl()).isEqualTo("https://img.example.com/og.jpg?w=960&h=540");
    }

    @Test
    void returnsEmptyWithoutRecipe() {
        assertThat(RecipeJsonLdParser.parse("<html><script type='application/ld+json'>{broken</script></html>",
                "https://example.com", mapper)).isEmpty();
    }

    @Test
    void rejectsPrivateAndNonHttpTargets() throws Exception {
        for (String url : new String[] {
                "http://localhost/x", "http://127.0.0.1/", "http://10.0.0.5/", "http://192.168.1.1/",
                "http://169.254.169.254/latest/meta-data", "file:///etc/passwd", "ftp://example.com/",
                "http://[::1]/", "http://example.com:8080/", "http://user@example.com/"}) {
            assertThatThrownBy(() -> RecipeImportService.validate(url))
                    .as(url)
                    .isInstanceOf(ResponseStatusException.class);
        }
        assertThat(RecipeImportService.isPublic(InetAddress.getByName("93.184.216.34"))).isTrue();
        assertThat(RecipeImportService.isPublic(InetAddress.getByName("100.64.0.1"))).isFalse();
        assertThat(RecipeImportService.isPublic(InetAddress.getByName("::ffff:127.0.0.1"))).isFalse();
        assertThat(RecipeImportService.isPublic(InetAddress.getByName("fd00::1"))).isFalse();
    }
}
