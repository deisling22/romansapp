package de.roman.speiseplan.pantry;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

/** Rough shelf-life guess for fresh groceries; unknown items get no date. Users can always correct it. */
final class ShelfLife {
    private static final Map<String, Integer> DAYS_BY_KEYWORD = new LinkedHashMap<>();

    static {
        // Order matters: more specific words first
        put(2, "hackfleisch", "hack", "fisch", "lachs", "garnele", "muschel");
        put(3, "hähnchen", "haehnchen", "huhn", "pute", "geflügel", "gefluegel", "fleisch", "schnitzel",
                "wurst", "aufschnitt", "beeren", "erdbeer", "himbeer", "salat", "spinat", "rucola",
                "champignon", "pilz", "kräuter", "kraeuter", "basilikum", "petersilie", "koriander");
        put(5, "milch", "sahne", "quark", "joghurt", "frischkäse", "frischkaese", "mozzarella", "feta",
                "tofu", "brot", "brötchen", "broetchen", "tomate", "gurke", "zucchini", "paprika",
                "brokkoli", "blumenkohl", "banane", "avocado", "lauch", "frühlingszwiebel");
        put(14, "käse", "kaese", "butter", "ei", "eier", "karotte", "möhre", "moehre", "apfel", "orange",
                "zitrone", "limette", "kohl", "sellerie");
        put(30, "kartoffel", "zwiebel", "knoblauch", "ingwer", "kürbis", "kuerbis");
    }

    private ShelfLife() {
    }

    private static void put(int days, String... keywords) {
        for (String keyword : keywords) {
            DAYS_BY_KEYWORD.putIfAbsent(keyword, days);
        }
    }

    static LocalDate guess(String ingredientName, LocalDate purchasedOn) {
        String name = ingredientName.toLowerCase(Locale.GERMAN);
        for (String word : name.split("[^\\p{L}]+")) {
            Integer days = DAYS_BY_KEYWORD.get(word);
            if (days != null) {
                return purchasedOn.plusDays(days);
            }
        }
        for (Map.Entry<String, Integer> entry : DAYS_BY_KEYWORD.entrySet()) {
            // Compound words like "Vollmilch" or "Rinderhackfleisch"; short keywords only as whole words
            if (entry.getKey().length() >= 4 && name.contains(entry.getKey())) {
                return purchasedOn.plusDays(entry.getValue());
            }
        }
        return null;
    }
}
