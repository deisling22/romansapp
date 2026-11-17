package de.roman.speiseplan.ingredient;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class IngredientMatcherTest {

    @Test
    void pluralSpellingAndSynonymsShareOneKey() {
        assertThat(IngredientMatcher.canonicalName("Tomaten")).isEqualTo(IngredientMatcher.canonicalName("tomate"));
        assertThat(IngredientMatcher.canonicalName("Zwiebeln")).isEqualTo("zwiebel");
        assertThat(IngredientMatcher.canonicalName("Eier")).isEqualTo("ei");
        assertThat(IngredientMatcher.canonicalName("Möhren")).isEqualTo(IngredientMatcher.canonicalName("Karotte"));
        assertThat(IngredientMatcher.canonicalName("Bio Kartoffeln (festkochend)")).isEqualTo("kartoffel");
        assertThat(IngredientMatcher.canonicalName("Rinderhack")).isEqualTo("rinderhackfleisch");
    }

    @Test
    void differentProductsStayDifferent() {
        assertThat(IngredientMatcher.canonicalName("Passierte Tomaten"))
                .isNotEqualTo(IngredientMatcher.canonicalName("Tomaten"));
        assertThat(IngredientMatcher.canonicalName("Reis")).isEqualTo("reis");
        assertThat(IngredientMatcher.canonicalName("Zutat-123")).isNotEqualTo(IngredientMatcher.canonicalName("Zutat-456"));
    }

    @Test
    void unitsOfTheSameIngredientAreComparable() {
        IngredientMatcher.Amount pieces = IngredientMatcher.normalize("Tomate", "Stk.", 3);
        IngredientMatcher.Amount grams = IngredientMatcher.normalize("Tomaten", "g", 300);
        IngredientMatcher.Amount kilos = IngredientMatcher.normalize("tomaten", "kg", 0.3);
        assertThat(pieces).isEqualTo(grams);
        assertThat(kilos.key()).isEqualTo(grams.key());
        assertThat(kilos.quantity()).isEqualTo(300.0);

        assertThat(IngredientMatcher.normalize("Milch", "l", 1)).isEqualTo(IngredientMatcher.normalize("Milch", "ml", 1000));
        assertThat(IngredientMatcher.normalize("Sahne", "Packung", 1)).isEqualTo(IngredientMatcher.normalize("Sahne", "ml", 200));
        // Unknown groceries cannot be converted between pieces and grams
        assertThat(IngredientMatcher.key("Drachenfrucht", "Stk."))
                .isNotEqualTo(IngredientMatcher.key("Drachenfrucht", "g"));
    }

    @Test
    void packagedGoodsAreBoughtInWholePacksAndSortedIntoAisles() {
        assertThat(IngredientMatcher.purchaseQuantity("Butter", "g", 120)).isEqualTo(250.0);
        assertThat(IngredientMatcher.purchaseQuantity("Butter", "g", 300)).isEqualTo(500.0);
        assertThat(IngredientMatcher.purchaseQuantity("Milch", "l", 0.15)).isEqualTo(1.0);
        assertThat(IngredientMatcher.purchaseQuantity("Tomaten", "g", 300)).isEqualTo(300.0);
        assertThat(IngredientMatcher.purchaseQuantity("Zwiebel", "Stk.", 2)).isEqualTo(2.0);

        assertThat(IngredientMatcher.category("Vollmilch")).isEqualTo("Kühlregal");
        assertThat(IngredientMatcher.category("Rinderhackfleisch")).isEqualTo("Fleisch & Fisch");
        assertThat(IngredientMatcher.category("Schweinefilet")).isEqualTo("Fleisch & Fisch");
        assertThat(IngredientMatcher.category("Zwiebeln")).isEqualTo("Obst & Gemüse");
        assertThat(IngredientMatcher.category("Thunfisch in Öl")).isEqualTo("Vorrat & Konserven");
        assertThat(IngredientMatcher.category("Schraubenzieher")).isEqualTo(IngredientMatcher.OTHER_CATEGORY);
    }
}
