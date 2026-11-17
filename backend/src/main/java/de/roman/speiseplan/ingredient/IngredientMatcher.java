package de.roman.speiseplan.ingredient;

import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

/**
 * Single source of truth for "is this the same ingredient?": recipes, shopping list and pantry are
 * compared through a canonical key (name without plural/synonym differences plus a base unit), so
 * "Tomaten 300 g", "Tomate 3 Stk." and "tomaten 0,3 kg" all describe the same stock.
 */
public final class IngredientMatcher {
    public static final String OTHER_CATEGORY = "Sonstiges";

    private static final String MASS = "g";
    private static final String PIECE = "stk";

    private static final Set<String> STOP_WORDS = Set.of(
            "bio", "tk", "frisch", "frische", "frischer", "frisches", "gross", "grosse", "klein", "kleine",
            "mittelgross", "mittelgrosse", "gemischt", "ca");
    private static final Map<String, String> SYNONYMS = Map.ofEntries(
            Map.entry("eier", "ei"),
            Map.entry("karotte", "moehre"),
            Map.entry("aepfel", "apfel"),
            Map.entry("pilze", "pilz"),
            Map.entry("nuesse", "nuss"),
            Map.entry("hack", "hackfleisch"),
            Map.entry("gehacktes", "hackfleisch"),
            Map.entry("rinderhack", "rinderhackfleisch"),
            Map.entry("schlagsahne", "sahne"),
            Map.entry("paprikaschote", "paprika"),
            Map.entry("knoblauchzehe", "knoblauch"),
            Map.entry("lauchzwiebel", "fruehlingszwiebel"),
            Map.entry("huehnerbrust", "haehnchenbrust"),
            Map.entry("haehnchenbrustfilet", "haehnchenbrust"),
            Map.entry("zucchinis", "zucchini"),
            Map.entry("kiwis", "kiwi"),
            Map.entry("jogurt", "joghurt"),
            Map.entry("broccoli", "brokkoli"),
            Map.entry("oel", "speiseoel"));

    private static final Map<String, Double> MASS_FACTORS = Map.ofEntries(
            Map.entry("g", 1.0), Map.entry("gramm", 1.0), Map.entry("gr", 1.0),
            Map.entry("kg", 1000.0), Map.entry("kilo", 1000.0),
            // Liquids are treated as 1 ml = 1 g; precise enough to answer "is enough at home?".
            Map.entry("ml", 1.0), Map.entry("cl", 10.0), Map.entry("dl", 100.0),
            Map.entry("l", 1000.0), Map.entry("liter", 1000.0),
            Map.entry("el", 15.0), Map.entry("tl", 5.0), Map.entry("prise", 1.0));
    private static final Set<String> PACK_UNITS = Set.of(
            "packung", "pck", "pkg", "pack", "dose", "glas", "becher", "flasche", "beutel", "tuete", "bund", "netz");

    /** Rough knowledge about common groceries; specific names must come before the generic ones they contain. */
    private record Knowledge(String category, double pieceGrams, double packGrams) {
    }

    private static final Map<String, Knowledge> KNOWLEDGE = new LinkedHashMap<>();

    static {
        String produce = "Obst & Gemüse";
        String chilled = "Kühlregal";
        String meat = "Fleisch & Fisch";
        String bakery = "Brot & Backwaren";
        String staples = "Vorrat & Konserven";
        String frozen = "Tiefkühl";
        String drinks = "Getränke";

        know(staples, 0, 500, "passierte Tomaten");
        know(staples, 0, 400, "gehackte Tomaten", "Tomatensauce", "Tomatensoße", "Kokosmilch", "Kichererbsen",
                "Kidneybohnen");
        know(staples, 0, 200, "Tomatenmark");
        know(staples, 0, 150, "Thunfisch");
        know(frozen, 30, 450, "Fischstäbchen");
        know(frozen, 0, 450, "Tiefkühl", "Erbsen", "Pizza");
        know(meat, 0, 500, "Hackfleisch");
        know(meat, 200, 400, "Hähnchenbrust", "Putenbrust");
        know(meat, 150, 400, "Schnitzel", "Steak");
        know(meat, 125, 250, "Lachs");
        know(meat, 0, 400, "Hähnchen", "Huhn", "Pute", "Geflügel", "Schwein", "Fleisch", "Fisch");
        know(meat, 0, 225, "Garnelen");
        know(meat, 0, 125, "Speck", "Schinken", "Salami", "Wurst", "Aufschnitt");

        know(produce, 15, 250, "Cherrytomaten", "Cocktailtomaten");
        know(produce, 100, 0, "Tomate", "Zitrone");
        know(produce, 15, 150, "Frühlingszwiebel");
        know(produce, 80, 0, "Zwiebel", "Möhre");
        know(produce, 5, 0, "Knoblauch");
        know(produce, 150, 0, "Paprika", "Apfel");
        know(produce, 250, 0, "Zucchini");
        know(produce, 400, 0, "Gurke", "Brokkoli");
        know(produce, 300, 0, "Süßkartoffel", "Aubergine", "Salat");
        know(produce, 120, 0, "Kartoffel", "Banane");
        know(produce, 800, 0, "Blumenkohl", "Kohl");
        know(produce, 1000, 0, "Kürbis");
        know(produce, 200, 0, "Lauch", "Orange");
        know(produce, 180, 0, "Avocado");
        know(produce, 70, 0, "Limette", "Kiwi");
        know(produce, 30, 0, "Ingwer");
        know(produce, 20, 250, "Champignon", "Pilz");
        know(produce, 0, 250, "Spinat", "Beeren");
        know(produce, 0, 125, "Rucola");
        know(produce, 0, 30, "Kräuter", "Basilikum", "Petersilie", "Koriander", "Schnittlauch", "Dill", "Minze");
        know(produce, 0, 0, "Sellerie", "Obst", "Gemüse");

        know(chilled, 60, 600, "Ei");
        know(chilled, 0, 1000, "Milch");
        know(chilled, 0, 200, "Sahne", "Schmand", "Creme fraiche", "Frischkäse", "Feta", "Tofu", "Käse", "Gouda");
        know(chilled, 0, 250, "Quark", "Butter", "Margarine");
        know(chilled, 0, 500, "Joghurt", "Skyr");
        know(chilled, 0, 125, "Mozzarella");
        know(chilled, 0, 100, "Parmesan");
        know(chilled, 0, 42, "Hefe");

        know(bakery, 0, 500, "Brot", "Toast");
        know(bakery, 60, 0, "Brötchen", "Wrap", "Tortilla");

        know(staples, 0, 500, "Nudeln", "Spaghetti", "Penne", "Pasta", "Reis", "Linsen", "Couscous", "Bulgur",
                "Haferflocken", "Müsli", "Öl", "Olivenöl", "Essig");
        know(staples, 0, 1000, "Mehl", "Zucker");
        know(staples, 0, 400, "Bohnen", "Mais");
        know(staples, 0, 200, "Nuss", "Mandeln");
        know(staples, 0, 0, "Salz", "Pfeffer", "Gewürz", "Brühe", "Honig", "Senf", "Ketchup", "Sojasauce",
                "Backpulver", "Paprikapulver", "Curry", "Zimt");

        know(drinks, 0, 500, "Kaffee");
        know(drinks, 0, 0, "Wasser", "Saft", "Tee", "Bier", "Wein", "Limonade");
    }

    private IngredientMatcher() {
    }

    private static void know(String category, double pieceGrams, double packGrams, String... names) {
        for (String name : names) {
            KNOWLEDGE.putIfAbsent(canonicalName(name), new Knowledge(category, pieceGrams, packGrams));
        }
    }

    /** Quantity of an ingredient expressed in its base unit, addressed by the canonical key. */
    public record Amount(String key, double quantity) {
    }

    public static String canonicalName(String name) {
        String folded = name.toLowerCase(Locale.GERMAN)
                .replace("ä", "ae").replace("ö", "oe").replace("ü", "ue").replace("ß", "ss")
                .replaceAll("\\(.*?\\)", " ");
        int comma = folded.indexOf(',');
        if (comma > 0) {
            folded = folded.substring(0, comma);
        }
        StringBuilder canonical = new StringBuilder();
        for (String word : folded.split("[^\\p{L}\\p{N}]+")) {
            if (word.isEmpty() || STOP_WORDS.contains(word)) {
                continue;
            }
            if (canonical.length() > 0) {
                canonical.append(' ');
            }
            canonical.append(singular(word));
        }
        return canonical.length() == 0 ? folded.trim() : canonical.toString();
    }

    private static String singular(String word) {
        String synonym = SYNONYMS.get(word);
        if (synonym != null) {
            return synonym;
        }
        String stem = word;
        if (word.length() > 5 && (word.endsWith("eln") || word.endsWith("ern"))) {
            stem = word.substring(0, word.length() - 1);
        } else if (word.length() > 4 && word.endsWith("en")) {
            stem = word.substring(0, word.length() - 1);
        } else if (word.length() > 5 && (word.endsWith("as") || word.endsWith("os") || word.endsWith("ns"))) {
            stem = word.substring(0, word.length() - 1);
        }
        return SYNONYMS.getOrDefault(stem, stem);
    }

    public static String key(String name, String unit) {
        return canonicalName(name) + "|" + baseUnit(name, unit);
    }

    public static Amount normalize(String name, String unit, double quantity) {
        return new Amount(key(name, unit), quantity * baseFactor(name, unit));
    }

    /** Multiply a quantity in {@code unit} by this factor to get the base-unit quantity. */
    public static double baseFactor(String name, String unit) {
        String normalizedUnit = normalizeUnit(unit);
        Double massFactor = MASS_FACTORS.get(normalizedUnit);
        if (massFactor != null) {
            return massFactor;
        }
        Knowledge knowledge = knowledge(name);
        if (knowledge == null) {
            return 1;
        }
        if (PACK_UNITS.contains(normalizedUnit) && knowledge.packGrams() > 0) {
            return knowledge.packGrams();
        }
        return knowledge.pieceGrams() > 0 ? knowledge.pieceGrams() : 1;
    }

    private static String baseUnit(String name, String unit) {
        String normalizedUnit = normalizeUnit(unit);
        if (MASS_FACTORS.containsKey(normalizedUnit)) {
            return MASS;
        }
        Knowledge knowledge = knowledge(name);
        if (knowledge == null) {
            return PIECE;
        }
        boolean knownPack = PACK_UNITS.contains(normalizedUnit) && knowledge.packGrams() > 0;
        return knownPack || knowledge.pieceGrams() > 0 ? MASS : PIECE;
    }

    /** Pieces, packs and the like: only whole numbers can be bought. */
    public static boolean isCountUnit(String unit) {
        return !MASS_FACTORS.containsKey(normalizeUnit(unit));
    }

    /** Aisle of the supermarket, used to group the shopping list. */
    public static String category(String name) {
        Knowledge knowledge = knowledge(name);
        return knowledge == null ? OTHER_CATEGORY : knowledge.category();
    }

    /**
     * What actually ends up at home: weighed quantities of packaged goods are rounded up to whole packs
     * (120 g butter on the list means a 250 g pack in the pantry).
     */
    public static double purchaseQuantity(String name, String unit, double quantity) {
        double packSize = packSize(name, unit);
        if (packSize <= 0) {
            return quantity;
        }
        return Math.max(1, Math.ceil(quantity / packSize - 1e-6)) * packSize;
    }

    /** Pack size in the given unit, or 0 if the ingredient is weighed loosely or the unit is a count. */
    public static double packSize(String name, String unit) {
        Double massFactor = MASS_FACTORS.get(normalizeUnit(unit));
        Knowledge knowledge = knowledge(name);
        return massFactor == null || knowledge == null ? 0 : knowledge.packGrams() / massFactor;
    }

    private static Knowledge knowledge(String name) {
        String canonical = canonicalName(name);
        Knowledge exact = KNOWLEDGE.get(canonical);
        if (exact != null) {
            return exact;
        }
        for (Map.Entry<String, Knowledge> entry : KNOWLEDGE.entrySet()) {
            // Compound words like "Rinderhackfleisch" or "Vollmilch"; short keywords only match whole words
            if (entry.getKey().length() >= 4 && canonical.contains(entry.getKey())) {
                return entry.getValue();
            }
        }
        for (String word : canonical.split(" ")) {
            Knowledge byWord = KNOWLEDGE.get(word);
            if (byWord != null) {
                return byWord;
            }
        }
        return null;
    }

    private static String normalizeUnit(String unit) {
        if (unit == null) {
            return "";
        }
        return unit.trim().toLowerCase(Locale.GERMAN)
                .replace("ä", "ae").replace("ö", "oe").replace("ü", "ue")
                .replace(".", "");
    }
}
