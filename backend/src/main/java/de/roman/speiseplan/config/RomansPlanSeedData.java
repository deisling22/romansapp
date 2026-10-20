package de.roman.speiseplan.config;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** Rezepte für den Demo-Plan "Romans Plan" (Nährwerte pro 100 g/ml, gerundete Richtwerte). */
final class RomansPlanSeedData {
    static final String PLAN_NAME = "Romans Plan";

    private static final Map<String, double[]> NUTRITION = new HashMap<>();

    static {
        n("Ahornsirup", 260, 0); n("Ananas (Dose)", 55, 0.5); n("Avocado", 160, 2);
        n("Backpulver", 0, 0); n("Bacon", 540, 14); n("Basilikum", 23, 3.1); n("Basmatireis", 350, 7);
        n("Beeren (TK)", 45, 1); n("Bratwürste", 300, 13); n("Brokkoli", 34, 2.8);
        n("Brötchen", 270, 9); n("Bulgur", 340, 12); n("Butter", 741, 0.7); n("Champignons", 22, 3.1);
        n("Cheddar", 400, 25); n("Chilipulver", 282, 13); n("Couscous", 376, 13); n("Currypaste", 130, 3);
        n("Currypulver", 325, 14); n("Dill", 43, 3.5); n("Eier", 143, 13); n("Eisbergsalat", 14, 0.9);
        n("Erbsen", 81, 5); n("Erbsen-Möhren-Mix (TK)", 55, 3); n("Erdnussbutter", 600, 25);
        n("Erdnüsse", 600, 26); n("Feta", 264, 17); n("Fischsauce", 35, 5); n("Flusskrebsschwänze", 75, 16);
        n("Frischkäse", 225, 6); n("Frühlingszwiebeln", 32, 1.8); n("Garnelen", 85, 18);
        n("Gehackte Tomaten (Dose)", 21, 1.2); n("Gemüsebrühe", 5, 0.2); n("Gewürzgurken", 11, 0.5);
        n("Gnocchi", 150, 4); n("Gouda", 356, 25); n("Gurke", 15, 0.7); n("Haferflocken", 370, 13);
        n("Hähnchenbrust", 110, 23); n("Hähnchenkeulen", 190, 17); n("Halloumi", 320, 22);
        n("Hackfleisch gemischt", 250, 17); n("Honig", 304, 0.3); n("Ingwer", 80, 1.8);
        n("Italienische Kräuter", 0, 0); n("Joghurt", 63, 5); n("Kartoffeln", 77, 2);
        n("Ketchup", 100, 1.5); n("Kidneybohnen", 110, 8); n("Kirschtomaten", 18, 0.9);
        n("Knoblauch", 140, 6.4); n("Knollensellerie", 18, 1.5); n("Kochschinken", 116, 20);
        n("Kohlrabi", 27, 1.7); n("Kokosmilch", 197, 2); n("Kokosöl", 862, 0); n("Koriander", 23, 2);
        n("Kräuterquark", 110, 7); n("Kreuzkümmel", 375, 18); n("Kümmel", 333, 20);
        n("Lachsfilet", 200, 20); n("Lasagneplatten", 350, 12); n("Lauch", 31, 2.1);
        n("Limette", 30, 0.7); n("Magerquark", 67, 12); n("Mais", 86, 3.2); n("Mango", 60, 0.8);
        n("Mayonnaise", 680, 1); n("Mehl", 364, 10); n("Milch", 47, 3.4); n("Milchreis", 350, 7);
        n("Minze", 44, 3.3); n("Möhren", 41, 0.9); n("Mozzarella", 280, 18); n("Oliven", 115, 0.8);
        n("Olivenöl", 884, 0); n("Oregano", 265, 9); n("Paniermehl", 350, 12); n("Paprika", 31, 1);
        n("Paprikapulver", 282, 14); n("Parmesan", 392, 35); n("Petersilie", 36, 3);
        n("Pfefferkörner (grün)", 250, 10); n("Proteinpulver", 380, 75); n("Putenaufschnitt", 105, 20);
        n("Putenbrust", 105, 24); n("Räucherlachs", 180, 22); n("Reis", 350, 7); n("Rinderbrühe", 5, 0.5);
        n("Rinderfleisch für Gulasch", 135, 21); n("Rindergeschnetzeltes", 130, 21); n("Rinderhack", 250, 26);
        n("Rinderhüftsteak", 130, 22); n("Rindersteak", 150, 21); n("Rosmarin", 130, 3.3); n("Rucola", 25, 2.6);
        n("Sahne", 292, 2.1); n("Salami", 450, 20); n("Salatgurke", 15, 0.7); n("Sauerkirschen (Glas)", 63, 1);
        n("Saure Sahne", 160, 3); n("Schafskäse", 264, 17); n("Schalotte", 72, 2.5);
        n("Schmelzkäse", 270, 12); n("Schnittlauch", 28, 3); n("Schwarze Bohnen", 110, 7);
        n("Schweinefleisch (Geschnetzeltes)", 140, 21); n("Schweineschnitzel", 110, 22);
        n("Seelachsfilet", 80, 18); n("Senf", 66, 4); n("Sojasauce", 60, 6); n("Speisestärke", 350, 0.5);
        n("Spaghetti", 350, 12); n("Spargel (grün)", 20, 2.2); n("Sprotten", 200, 18);
        n("Suppennudeln", 350, 12); n("Süßkartoffel", 86, 1.6); n("Tagliatelle", 350, 12);
        n("Thunfisch (Dose)", 130, 26); n("Tofu", 120, 13); n("Tomaten", 18, 0.9);
        n("Tomatenmark", 80, 4.5); n("Toastbrot", 265, 9); n("Tortilla-Wraps", 310, 8);
        n("Passierte Tomaten", 29, 1.4); n("Vanilleextrakt", 288, 0.1); n("Vollkorntoast", 250, 9);
        n("Weißwein", 70, 0.1); n("Weißweinessig", 3, 0); n("Wiener Würstchen", 301, 12);
        n("Zimt", 247, 4); n("Zitrone", 29, 1); n("Zucchini", 17, 1.2); n("Zucker", 400, 0);
        n("Zwiebel", 40, 1.1); n("Balsamico", 90, 0.5); n("Öl", 884, 0);
    }

    static final List<RecipeData> RECIPES = List.of(
        r("Bratwurstsemmeln", "1601050690117-94f5f6fa8bd7", 15, 2, "fleisch,schnell,streetfood",
            "Knusprige Bratwürste mit Röstzwiebeln und Senf im frischen Brötchen.",
            List.of(i("Bratwürste", 4, "Stk."), i("Brötchen", 4, "Stk."), i("Zwiebel", 1, "Stk."),
                i("Öl", 15, "ml"), i("Senf", 2, "EL")),
            List.of(s("Zwiebel in feine Ringe schneiden und in etwas Öl bei mittlerer Hitze goldbraun braten.", 8),
                s("Bratwürste in einer Pfanne oder auf dem Grill rundum braten, bis sie gar und knusprig sind.", 11),
                s("Brötchen aufschneiden und kurz im Ofen oder Toaster aufknuspern."),
                s("Bratwürste in die Brötchen legen, Röstzwiebeln und Senf dazugeben und warm servieren."))),

        r("Milchreis", "1528207776546-365bb710ee93", 35, 4, "vegetarisch,dessert,familie",
            "Cremiger Milchreis wie von Oma mit Zimt-Zucker und heißen Kirschen oder Apfelmus.",
            List.of(i("Milch", 1000, "ml"), i("Milchreis", 250), i("Zucker", 15), i("Vanilleextrakt", 1, "TL"),
                i("Sauerkirschen (Glas)", 350), i("Zimt", 1, "TL")),
            List.of(s("Milch, Zucker, Vanilleextrakt und eine Prise Salz in einem Topf mit dickem Boden vorsichtig aufkochen."),
                s("Milchreis hinzufügen und alles noch einmal aufkochen."),
                s("Bei niedriger Hitze mit Deckel etwa 30 Minuten garen und gelegentlich umrühren, damit nichts anbrennt.", 30),
                s("Kurz vor Ende der Garzeit mit einem Schneebesen durchrühren – so wird der Milchreis besonders cremig."),
                s("Kirschen erhitzen und den Milchreis heiß mit Zimt, etwas Zucker und den Kirschen (oder Apfelmus) servieren."))),

        r("Puten-Mango-Curry", "1455619452474-d2be8b1e70cd", 30, 2, "fleisch,curry,fruchtig",
            "Zartes Putenfleisch in cremiger Kokos-Curry-Sauce mit süßer Mango.",
            List.of(i("Putenbrust", 300), i("Mango", 200), i("Zwiebel", 1, "Stk."), i("Knoblauch", 2, "Stk."),
                i("Ingwer", 10), i("Currypaste", 2, "EL"), i("Kokosmilch", 200, "ml"), i("Paprika", 1, "Stk."),
                i("Basmatireis", 150), i("Öl", 15, "ml")),
            List.of(s("Reis nach Packungsangabe garen."),
                s("Putenbrust in Würfel, Zwiebel, Knoblauch und Ingwer fein schneiden. Paprika würfeln, Mango schälen und in Stücke schneiden."),
                s("Öl in einer großen Pfanne erhitzen und die Putenwürfel rundum anbraten, dann herausnehmen.", 5),
                s("Zwiebel, Knoblauch und Ingwer anschwitzen, Currypaste kurz mitrösten und mit der Kokosmilch ablöschen."),
                s("Paprika und Pute zurück in die Pfanne geben und bei mittlerer Hitze köcheln lassen.", 8),
                s("Mango unterheben, kurz erwärmen, mit Salz abschmecken und mit dem Reis servieren."))),

        r("Ungarisches Gulasch", "1533777857889-4be7c70b33f7", 120, 4, "fleisch,eintopf,deftig",
            "Würziges Rindergulasch mit viel Paprika, langsam geschmort.",
            List.of(i("Rinderfleisch für Gulasch", 800), i("Zwiebel", 4, "Stk."), i("Paprika", 2, "Stk."),
                i("Kartoffeln", 400), i("Tomatenmark", 2, "EL"), i("Paprikapulver", 3, "EL"),
                i("Knoblauch", 2, "Stk."), i("Kümmel", 1, "TL"), i("Rinderbrühe", 600, "ml"), i("Öl", 30, "ml")),
            List.of(s("Zwiebeln würfeln, Fleisch trocken tupfen, Paprika und Kartoffeln in mundgerechte Stücke schneiden."),
                s("Öl in einem schweren Topf erhitzen und das Fleisch portionsweise scharf anbraten, dann herausnehmen.", 10),
                s("Zwiebeln im Bratfett glasig dünsten, Tomatenmark, Knoblauch, Paprikapulver und Kümmel kurz mitrösten (Paprikapulver nicht verbrennen lassen).", 8),
                s("Fleisch zurück in den Topf geben, mit der Brühe ablöschen und zugedeckt bei niedriger Hitze schmoren.", 75),
                s("Paprika und Kartoffeln zugeben und weitere Zeit garen, bis alles weich ist.", 30),
                s("Mit Salz und Pfeffer abschmecken und mit frischem Brot servieren."))),

        r("Schnitzel mit Gurkensalat", "1534948216015-843149f72be3", 30, 2, "fleisch,klassiker",
            "Knuspriges Schnitzel mit frischem Joghurt-Gurkensalat und Zitrone.",
            List.of(i("Schweineschnitzel", 300), i("Mehl", 40), i("Eier", 1, "Stk."), i("Paniermehl", 80),
                i("Öl", 60, "ml"), i("Zitrone", 1, "Stk."), i("Salatgurke", 1, "Stk."), i("Joghurt", 100),
                i("Dill", 1, "EL"), i("Weißweinessig", 2, "EL"), i("Zucker", 1, "TL")),
            List.of(s("Gurke hobeln, salzen und ziehen lassen, dann das Wasser ausdrücken.", 10),
                s("Gurke mit Joghurt, Essig, Zucker und Dill vermengen und kalt stellen."),
                s("Schnitzel flach klopfen, salzen und pfeffern."),
                s("Schnitzel nacheinander in Mehl, verquirltem Ei und Paniermehl wenden und die Panade leicht andrücken."),
                s("Öl in einer Pfanne erhitzen und die Schnitzel von beiden Seiten goldbraun braten.", 8),
                s("Auf Küchenpapier abtropfen lassen und mit Zitronenspalten und Gurkensalat servieren."))),

        r("Tofucurry mit Frühlingsgemüse", "1546069901-ba9599a7e63c", 25, 2, "vegetarisch,curry,vegan",
            "Mildes Kokos-Curry mit knusprigem Tofu, grünem Spargel, Erbsen und Möhren.",
            List.of(i("Tofu", 200), i("Kokosmilch", 200, "ml"), i("Currypaste", 2, "EL"), i("Spargel (grün)", 200),
                i("Erbsen", 100), i("Möhren", 2, "Stk."), i("Frühlingszwiebeln", 3, "Stk."),
                i("Basmatireis", 150), i("Sojasauce", 1, "EL"), i("Öl", 15, "ml")),
            List.of(s("Reis nach Packungsangabe garen."),
                s("Tofu abtropfen lassen und würfeln. Spargel in Stücke, Möhren in Scheiben und Frühlingszwiebeln in Ringe schneiden."),
                s("Tofu in Öl rundum knusprig braten, mit Sojasauce würzen und herausnehmen.", 6),
                s("Möhren und Spargel kurz anbraten, Currypaste einrühren und mit der Kokosmilch ablöschen."),
                s("Erbsen zugeben und das Gemüse bissfest köcheln lassen.", 8),
                s("Tofu und Frühlingszwiebeln unterheben und das Curry mit dem Reis servieren."))),

        r("Hühnersuppe", "1547592166-23ac45744acd", 75, 4, "suppe,fleisch,klassiker",
            "Klare Hühnersuppe mit Gemüse und Suppennudeln – Wohlfühlessen für kalte Tage.",
            List.of(i("Hähnchenkeulen", 800), i("Möhren", 3, "Stk."), i("Knollensellerie", 150), i("Lauch", 1, "Stk."),
                i("Zwiebel", 1, "Stk."), i("Suppennudeln", 100), i("Petersilie", 2, "EL")),
            List.of(s("Hähnchenkeulen mit etwa 1,5 Litern kaltem Wasser und der halbierten Zwiebel aufsetzen und langsam zum Kochen bringen. Schaum abschöpfen."),
                s("Bei niedriger Hitze ohne Deckel köcheln lassen.", 40),
                s("Möhren, Sellerie und Lauch in Stücke schneiden, zur Brühe geben und weiter garen.", 20),
                s("Hähnchenkeulen herausnehmen, Fleisch von den Knochen lösen und klein zupfen."),
                s("Suppennudeln in der Brühe garen, das Fleisch wieder zugeben.", 8),
                s("Mit Salz und Pfeffer abschmecken und mit Petersilie bestreut servieren."))),

        r("Spaghetti mit Räucherlachs und Garnelen", "1563379926898-05f4575a45d8", 20, 2, "fisch,schnell,cremig",
            "Cremige Zitronen-Dill-Sauce mit Räucherlachs und Garnelen – wahlweise mit einem von beiden.",
            List.of(i("Spaghetti", 200), i("Räucherlachs", 100), i("Garnelen", 150), i("Sahne", 150, "ml"),
                i("Knoblauch", 1, "Stk."), i("Zitrone", 1, "Stk."), i("Dill", 1, "EL"), i("Olivenöl", 15, "ml")),
            List.of(s("Spaghetti in Salzwasser bissfest kochen.", 9),
                s("Knoblauch fein hacken, Räucherlachs in Streifen schneiden. Garnelen trocken tupfen."),
                s("Garnelen in Olivenöl 2–3 Minuten braten, Knoblauch kurz mitbraten.", 3),
                s("Sahne zugießen, mit Zitronenabrieb, Zitronensaft, Salz und Pfeffer einkochen."),
                s("Spaghetti in der Sauce schwenken, Lachs und Dill unterheben und sofort servieren."))),

        r("Sous-Vide-Steak mit Mais und Kräuterbutter", "1546964124-0cce460f38ef", 75, 2, "fleisch,sous-vide,steak",
            "Gleichmäßig rosa gegartes Steak mit Kräuterbutter und buttrigem Mais.",
            List.of(i("Rindersteak", 500), i("Mais", 200), i("Butter", 80), i("Knoblauch", 1, "Stk."),
                i("Petersilie", 1, "EL"), i("Schnittlauch", 1, "EL"), i("Olivenöl", 15, "ml")),
            List.of(s("Sous-Vide-Gerät auf 54 °C (medium rare) einstellen. Steaks mit Salz, Pfeffer und etwas Olivenöl vakuumieren."),
                s("Steaks im Wasserbad garen.", 60),
                s("Für die Kräuterbutter weiche Butter mit fein gehacktem Knoblauch, Petersilie, Schnittlauch und Salz verrühren, zu einer Rolle formen und kühlen.", 30),
                s("Mais in einem Teil der Butter erhitzen und mit Salz und Pfeffer würzen."),
                s("Steaks aus dem Beutel nehmen, trocken tupfen und in einer sehr heißen Pfanne pro Seite scharf anbraten.", 2),
                s("Steaks kurz ruhen lassen und mit Scheiben der Kräuterbutter und dem Mais servieren."))),

        r("Sandwich \"American Style\"", "1528735602780-2552fd46c7af", 15, 2, "sandwich,schnell,streetfood",
            "Getoastetes Sandwich mit Bacon, Pute, Schinken, Cheddar und frischem Gemüse.",
            List.of(i("Toastbrot", 4, "Stk."), i("Bacon", 4, "Stk."), i("Putenaufschnitt", 100), i("Kochschinken", 100),
                i("Cheddar", 80), i("Eisbergsalat", 80), i("Tomaten", 1, "Stk."), i("Gewürzgurken", 4, "Stk."),
                i("Mayonnaise", 2, "EL"), i("Senf", 1, "TL")),
            List.of(s("Bacon in einer Pfanne knusprig braten und auf Küchenpapier abtropfen lassen.", 8),
                s("Toastbrote goldbraun rösten."),
                s("Mayonnaise mit Senf verrühren und auf die Toastscheiben streichen."),
                s("Mit Salat, Tomatenscheiben, Pute, Schinken, Cheddar, Bacon und Gurkenscheiben schichten."),
                s("Sandwiches diagonal durchschneiden und mit Zahnstochern fixieren."))),

        r("Brokkoli-Cremesuppe", "1547592166-23ac45744acd", 30, 4, "suppe,vegetarisch,cremig",
            "Samtige Suppe aus Brokkoli und Kartoffeln mit einem Schuss Sahne.",
            List.of(i("Brokkoli", 600), i("Kartoffeln", 250), i("Zwiebel", 1, "Stk."), i("Knoblauch", 1, "Stk."),
                i("Gemüsebrühe", 800, "ml"), i("Sahne", 150, "ml"), i("Butter", 20)),
            List.of(s("Zwiebel und Knoblauch fein würfeln, Kartoffeln schälen und klein schneiden, Brokkoli in Röschen teilen."),
                s("Butter im Topf schmelzen und Zwiebel und Knoblauch glasig dünsten."),
                s("Kartoffeln und Brokkoli zugeben, mit Brühe auffüllen und zugedeckt kochen.", 15),
                s("Sahne zugeben und die Suppe fein pürieren."),
                s("Mit Salz, Pfeffer und Muskat abschmecken und heiß servieren."))),

        r("Hähnchen-Wraps", "1626700051175-6818013e1d4f", 20, 2, "fleisch,wraps,schnell",
            "Gebratene Hähnchenstreifen mit Salat, Tomate und Joghurt-Sauce in weichen Wraps.",
            List.of(i("Tortilla-Wraps", 4, "Stk."), i("Hähnchenbrust", 300), i("Eisbergsalat", 100),
                i("Tomaten", 2, "Stk."), i("Gurke", 1, "Stk."), i("Joghurt", 100), i("Gouda", 50),
                i("Paprikapulver", 1, "TL"), i("Öl", 15, "ml")),
            List.of(s("Hähnchen in Streifen schneiden und mit Paprikapulver, Salz und Pfeffer würzen."),
                s("In heißem Öl rundum braten, bis es durchgegart ist.", 8),
                s("Salat, Tomaten und Gurke klein schneiden. Joghurt mit Salz und Pfeffer verrühren."),
                s("Wraps kurz in einer trockenen Pfanne erwärmen."),
                s("Wraps mit Joghurt bestreichen, mit Salat, Gemüse, Hähnchen und Käse füllen und fest einrollen."))),

        r("Seelachs mit Kartoffelpüree", "1574484284002-952d92456975", 35, 2, "fisch,klassiker",
            "Gebratener Seelachs mit cremigem Kartoffelpüree und Erbsen.",
            List.of(i("Seelachsfilet", 300), i("Kartoffeln", 500), i("Milch", 100, "ml"), i("Butter", 30),
                i("Mehl", 20), i("Zitrone", 1, "Stk."), i("Erbsen", 150), i("Petersilie", 1, "EL")),
            List.of(s("Kartoffeln schälen, vierteln und in Salzwasser weich kochen.", 20),
                s("Kartoffeln abgießen, mit warmer Milch und der Hälfte der Butter stampfen und mit Salz und Muskat abschmecken."),
                s("Erbsen in wenig Wasser erhitzen."),
                s("Seelachs mit Zitronensaft beträufeln, salzen und leicht in Mehl wenden."),
                s("Restliche Butter in der Pfanne erhitzen und den Fisch von jeder Seite goldbraun braten.", 6),
                s("Mit Püree, Erbsen und Petersilie anrichten."))),

        r("Arabisch mariniertes Rinderhüftsteak mit Ofen-Karottensticks", "1600891964092-4316c288032e", 45, 2,
            "fleisch,orientalisch,ofen",
            "Steak in Zitronen-Gewürz-Marinade mit knusprigen Karottensticks und Minz-Joghurt.",
            List.of(i("Rinderhüftsteak", 400), i("Möhren", 400), i("Olivenöl", 45, "ml"), i("Zitrone", 1, "Stk."),
                i("Knoblauch", 2, "Stk."), i("Kreuzkümmel", 1, "TL"), i("Paprikapulver", 1, "TL"),
                i("Zimt", 1, "TL"), i("Honig", 1, "TL"), i("Joghurt", 100), i("Minze", 2, "EL")),
            List.of(s("Aus Olivenöl, Zitronensaft, gepresstem Knoblauch, Kreuzkümmel, Paprika, Zimt, Salz und Pfeffer eine Marinade rühren. Steaks darin marinieren.", 30),
                s("Ofen auf 220 °C vorheizen. Möhren in Sticks schneiden, mit Olivenöl, Honig und Salz mischen und auf einem Blech verteilen."),
                s("Möhrensticks im Ofen backen, bis sie gebräunt sind.", 25),
                s("Joghurt mit gehackter Minze, Salz und etwas Zitronensaft verrühren."),
                s("Steaks in einer sehr heißen Pfanne pro Seite 3–4 Minuten braten.", 7),
                s("Steaks 5 Minuten ruhen lassen, aufschneiden und mit Karottensticks und Minz-Joghurt servieren.", 5))),

        r("Truthahnbrust-Sandwich", "1509722747041-616f39b57569", 15, 2, "sandwich,schnell,leicht",
            "Leichtes Sandwich mit Putenbrust, Frischkäse, Salat und Tomate.",
            List.of(i("Vollkorntoast", 4, "Stk."), i("Putenaufschnitt", 150), i("Frischkäse", 60), i("Eisbergsalat", 60),
                i("Tomaten", 1, "Stk."), i("Salatgurke", 1, "Stk."), i("Senf", 1, "TL")),
            List.of(s("Toastscheiben leicht rösten."),
                s("Frischkäse mit Senf verrühren und auf allen Scheiben verstreichen."),
                s("Tomate und Gurke in Scheiben schneiden, Salat zupfen."),
                s("Mit Putenbrust, Salat, Tomaten und Gurke belegen, zusammenklappen und halbieren."))),

        r("Taboulé-Salat mit Halloumi", "1511690656952-34342bb7c2f2", 25, 2, "vegetarisch,salat,orientalisch",
            "Frischer Kräutersalat mit Bulgur, Gurke und Tomate, dazu gebratener Halloumi.",
            List.of(i("Bulgur", 120), i("Halloumi", 200), i("Salatgurke", 1, "Stk."), i("Tomaten", 3, "Stk."),
                i("Frühlingszwiebeln", 3, "Stk."), i("Petersilie", 4, "EL"), i("Minze", 2, "EL"),
                i("Zitrone", 1, "Stk."), i("Olivenöl", 45, "ml")),
            List.of(s("Bulgur mit heißem Salzwasser übergießen und zugedeckt quellen lassen.", 15),
                s("Gurke und Tomaten fein würfeln, Frühlingszwiebeln in Ringe schneiden, Kräuter hacken."),
                s("Zitronensaft mit Olivenöl, Salz und Pfeffer verrühren."),
                s("Bulgur mit Gemüse, Kräutern und Dressing mischen und kurz ziehen lassen."),
                s("Halloumi in Scheiben schneiden und in einer Pfanne ohne Fett von beiden Seiten goldbraun braten.", 4),
                s("Halloumi auf dem Salat anrichten und servieren."))),

        r("Hähnchenpfanne süß-sauer", "1604908176997-125f25cc6f3d", 30, 2, "fleisch,asiatisch,pfanne",
            "Zarte Hähnchenstücke mit Paprika, Ananas und fruchtig-saurer Sauce.",
            List.of(i("Hähnchenbrust", 300), i("Paprika", 1, "Stk."), i("Ananas (Dose)", 150), i("Möhren", 1, "Stk."),
                i("Zwiebel", 1, "Stk."), i("Ketchup", 3, "EL"), i("Sojasauce", 2, "EL"), i("Weißweinessig", 2, "EL"),
                i("Zucker", 1, "EL"), i("Speisestärke", 1, "EL"), i("Reis", 150), i("Öl", 15, "ml")),
            List.of(s("Reis nach Packungsangabe garen."),
                s("Hähnchen würfeln und mit Stärke vermengen. Gemüse und Ananas in mundgerechte Stücke schneiden, Ananassaft aufheben."),
                s("Hähnchen in Öl kräftig anbraten und herausnehmen.", 5),
                s("Möhren, Zwiebel und Paprika anbraten."),
                s("Ketchup, Sojasauce, Essig, Zucker und den Ananassaft verrühren, in die Pfanne geben und aufkochen."),
                s("Hähnchen und Ananas zugeben und in der Sauce erhitzen, bis sie leicht bindet.", 5),
                s("Mit dem Reis servieren."))),

        r("Tagliatelle mit Flusskrebsen", "1473093295043-cdd812d0e601", 25, 2, "fisch,cremig,schnell",
            "Bandnudeln in feiner Weißwein-Sahne-Sauce mit Flusskrebsschwänzen und Kirschtomaten.",
            List.of(i("Tagliatelle", 200), i("Flusskrebsschwänze", 200), i("Sahne", 150, "ml"), i("Knoblauch", 2, "Stk."),
                i("Schalotte", 1, "Stk."), i("Weißwein", 50, "ml"), i("Kirschtomaten", 150), i("Dill", 1, "EL"),
                i("Zitrone", 1, "Stk."), i("Butter", 20)),
            List.of(s("Tagliatelle in Salzwasser bissfest kochen.", 9),
                s("Schalotte und Knoblauch fein würfeln, Kirschtomaten halbieren."),
                s("Butter erhitzen, Schalotte und Knoblauch glasig dünsten und mit Weißwein ablöschen."),
                s("Sahne zugeben und kurz einkochen lassen."),
                s("Flusskrebse und Tomaten zugeben und nur erwärmen.", 3),
                s("Nudeln unterheben, mit Zitronensaft, Salz, Pfeffer und Dill abschmecken und servieren."))),

        r("Rindergeschnetzeltes mit Selleriestampf", "1504674900247-0877df9cc836", 35, 2, "fleisch,low-carb,cremig",
            "Geschnetzeltes mit Champignons in Sahnesauce auf cremigem Sellerie-Kartoffel-Stampf.",
            List.of(i("Rindergeschnetzeltes", 350), i("Knollensellerie", 400), i("Kartoffeln", 200), i("Milch", 100, "ml"),
                i("Butter", 30), i("Zwiebel", 1, "Stk."), i("Champignons", 150), i("Sahne", 100, "ml"),
                i("Rinderbrühe", 100, "ml"), i("Öl", 15, "ml"), i("Petersilie", 1, "EL")),
            List.of(s("Sellerie und Kartoffeln schälen, würfeln und in Salzwasser weich kochen.", 20),
                s("Abgießen, mit Milch und Butter stampfen und mit Salz und Muskat würzen."),
                s("Zwiebel würfeln, Champignons in Scheiben schneiden."),
                s("Fleisch in heißem Öl portionsweise scharf anbraten und herausnehmen.", 4),
                s("Zwiebel und Champignons anbraten, mit Brühe und Sahne ablöschen und einkochen lassen.", 5),
                s("Fleisch zurück in die Sauce geben, abschmecken und auf dem Stampf mit Petersilie servieren."))),

        r("Würzige mexikanische Rindfleisch-Burritos", "1626700051175-6818013e1d4f", 40, 4, "fleisch,mexikanisch,wraps",
            "Gefüllte Weizentortillas mit würzigem Hack, Bohnen, Mais, Reis und Käse.",
            List.of(i("Tortilla-Wraps", 4, "Stk."), i("Rinderhack", 400), i("Zwiebel", 1, "Stk."),
                i("Knoblauch", 2, "Stk."), i("Paprika", 1, "Stk."), i("Kidneybohnen", 240), i("Mais", 100),
                i("Passierte Tomaten", 200), i("Kreuzkümmel", 1, "TL"), i("Paprikapulver", 2, "TL"),
                i("Chilipulver", 1, "TL"), i("Reis", 100), i("Gouda", 100), i("Saure Sahne", 100), i("Öl", 15, "ml")),
            List.of(s("Reis nach Packungsangabe garen."),
                s("Zwiebel, Knoblauch und Paprika fein würfeln."),
                s("Hackfleisch in Öl krümelig anbraten, Zwiebel, Knoblauch und Paprika zugeben.", 8),
                s("Kreuzkümmel, Paprikapulver und Chili einrühren, Tomaten, Bohnen und Mais zugeben und einköcheln lassen.", 10),
                s("Tortillas erwärmen, mit Reis, Hackfüllung und Käse belegen, seitlich einschlagen und aufrollen."),
                s("Burritos kurz im Ofen oder in der Pfanne überbacken und mit saurer Sahne servieren."))),

        r("Protein-Kaiserschmarrn", "1567620905732-2d1ec7ab7445", 20, 2, "vegetarisch,protein,dessert",
            "Fluffiger Schmarrn mit Magerquark und Proteinpulver, mit Beeren und Ahornsirup.",
            List.of(i("Magerquark", 250), i("Eier", 3, "Stk."), i("Proteinpulver", 30), i("Haferflocken", 50),
                i("Milch", 100, "ml"), i("Backpulver", 1, "TL"), i("Butter", 15), i("Beeren (TK)", 150),
                i("Ahornsirup", 1, "EL")),
            List.of(s("Eier trennen. Eigelb mit Quark, Proteinpulver, Haferflocken, Milch und Backpulver glatt rühren."),
                s("Eiweiß steif schlagen und vorsichtig unter den Teig heben."),
                s("Butter in einer großen beschichteten Pfanne erhitzen, den Teig hineingeben und bei mittlerer Hitze stocken lassen.", 4),
                s("Teig wenden und mit zwei Gabeln in Stücke reißen, weiter goldbraun braten.", 4),
                s("Beeren kurz in der Pfanne erwärmen und den Schmarrn mit Ahornsirup servieren."))),

        r("Krosse Hähnchenbrust mit Basilikum-Mantelkruste", "1604908176997-125f25cc6f3d", 35, 2, "fleisch,ofen,knusprig",
            "Saftige Hähnchenbrust unter einer knusprigen Kruste aus Basilikum, Parmesan und Butter.",
            List.of(i("Hähnchenbrust", 350), i("Paniermehl", 50), i("Parmesan", 30), i("Basilikum", 20),
                i("Knoblauch", 1, "Stk."), i("Butter", 30), i("Senf", 1, "EL"), i("Kirschtomaten", 150),
                i("Olivenöl", 15, "ml")),
            List.of(s("Ofen auf 200 °C Ober-/Unterhitze vorheizen."),
                s("Basilikum und Knoblauch fein hacken und mit Paniermehl, Parmesan und weicher Butter zu einer Kruste verkneten."),
                s("Hähnchenbrust salzen, pfeffern und dünn mit Senf bestreichen."),
                s("Kruste auf dem Fleisch verteilen und andrücken. Mit den Kirschtomaten in eine geölte Form legen."),
                s("Im Ofen backen, bis die Kruste knusprig und das Fleisch durchgegart ist.", 23),
                s("Kurz ruhen lassen, aufschneiden und mit den Tomaten servieren."))),

        r("Garnelen-Erdnuss-Curry (One-Pot)", "1455619452474-d2be8b1e70cd", 25, 2, "fisch,curry,one-pot",
            "Cremiges Kokos-Curry mit Erdnussbutter, Gemüse und Garnelen – alles in einem Topf.",
            List.of(i("Garnelen", 250), i("Kokosmilch", 200, "ml"), i("Erdnussbutter", 2, "EL"), i("Currypaste", 1, "EL"),
                i("Paprika", 1, "Stk."), i("Zucchini", 1, "Stk."), i("Zwiebel", 1, "Stk."), i("Knoblauch", 2, "Stk."),
                i("Sojasauce", 1, "EL"), i("Basmatireis", 120), i("Limette", 1, "Stk."), i("Erdnüsse", 20)),
            List.of(s("Zwiebel, Knoblauch, Paprika und Zucchini klein schneiden."),
                s("Zwiebel und Knoblauch in einem großen Topf anschwitzen, Currypaste und Erdnussbutter einrühren."),
                s("Kokosmilch, etwa 250 ml Wasser, Sojasauce und Reis zugeben, aufkochen und zugedeckt köcheln lassen.", 10),
                s("Paprika und Zucchini unterheben und weiter garen, bis der Reis weich ist.", 5),
                s("Garnelen auf den Reis legen und zugedeckt gar ziehen lassen.", 4),
                s("Mit Limettensaft abschmecken und mit gehackten Erdnüssen bestreut servieren."))),

        r("Rindersteak mit geschmorten Tomaten", "1546964124-0cce460f38ef", 30, 2, "fleisch,steak,mediterran",
            "Kurz gebratenes Steak mit Knoblauch-Rosmarin-Tomaten und Rucola.",
            List.of(i("Rindersteak", 400), i("Kirschtomaten", 300), i("Knoblauch", 2, "Stk."), i("Rosmarin", 2, "Zweig(e)"),
                i("Balsamico", 1, "EL"), i("Olivenöl", 30, "ml"), i("Butter", 20), i("Zucker", 1, "TL"), i("Rucola", 40)),
            List.of(s("Steaks etwa 30 Minuten vor dem Braten aus dem Kühlschrank nehmen und trocken tupfen.", 30),
                s("Olivenöl in einer Pfanne erhitzen. Tomaten mit Knoblauch, Rosmarin und Zucker schmoren, bis sie aufplatzen, mit Balsamico ablöschen.", 8),
                s("Tomaten warm stellen. Steaks salzen und in einer heißen Pfanne mit Butter pro Seite scharf braten.", 6),
                s("Steaks 5 Minuten ruhen lassen und pfeffern.", 5),
                s("Mit den geschmorten Tomaten und Rucola anrichten."))),

        r("Bratkartoffeln mit Würstchen", "1601050690117-94f5f6fa8bd7", 30, 2, "fleisch,klassiker,pfanne",
            "Knusprige Bratkartoffeln mit Zwiebeln und gebratenen Wiener Würstchen.",
            List.of(i("Kartoffeln", 600), i("Wiener Würstchen", 4, "Stk."), i("Zwiebel", 1, "Stk."), i("Öl", 30, "ml"),
                i("Petersilie", 1, "EL"), i("Paprikapulver", 1, "TL")),
            List.of(s("Kartoffeln in der Schale weich kochen, abkühlen lassen und in Scheiben schneiden (gern schon am Vortag).", 20),
                s("Öl in einer großen Pfanne erhitzen und die Kartoffelscheiben bei mittlerer Hitze knusprig braten.", 10),
                s("Zwiebel in Würfel schneiden und die letzten Minuten mitbraten. Mit Salz, Pfeffer und Paprikapulver würzen."),
                s("Würstchen in Stücke schneiden und kurz mitbraten."),
                s("Mit Petersilie bestreuen und servieren."))),

        r("Südsee-Feeling Tortilla-Bowl mit Bohnen-Avocado-Salat", "1512621776951-a57141f2eefd", 25, 2,
            "vegetarisch,mexikanisch,bowl",
            "Knusprige Tortilla-Schalen gefüllt mit Bohnen, Avocado, Mais, Mango und Limette.",
            List.of(i("Tortilla-Wraps", 2, "Stk."), i("Schwarze Bohnen", 240), i("Avocado", 1, "Stk."), i("Mais", 100),
                i("Tomaten", 2, "Stk."), i("Zwiebel", 1, "Stk."), i("Limette", 1, "Stk."), i("Koriander", 2, "EL"),
                i("Mango", 100), i("Joghurt", 100), i("Kreuzkümmel", 1, "TL")),
            List.of(s("Ofen auf 180 °C vorheizen. Tortillas in ofenfeste Schüsseln drücken und goldbraun backen.", 10),
                s("Bohnen abspülen, Mais abtropfen lassen. Avocado, Tomaten, Mango und Zwiebel würfeln."),
                s("Alles mit Limettensaft, Kreuzkümmel, Salz, Pfeffer und gehacktem Koriander vermengen."),
                s("Joghurt mit etwas Limettensaft verrühren."),
                s("Tortilla-Schalen füllen und mit einem Klecks Joghurt servieren."))),

        r("Wie in Indien: Schweinefleisch-Curry mit Basmatireis", "1565557623262-b51c2513a641", 40, 2,
            "fleisch,curry,indisch",
            "Würziges Curry mit zartem Schweinefleisch in Tomaten-Kokos-Sauce.",
            List.of(i("Schweinefleisch (Geschnetzeltes)", 350), i("Zwiebel", 2, "Stk."), i("Knoblauch", 2, "Stk."),
                i("Ingwer", 10), i("Currypulver", 2, "TL"), i("Tomatenmark", 1, "EL"), i("Passierte Tomaten", 200),
                i("Kokosmilch", 100, "ml"), i("Joghurt", 100), i("Basmatireis", 150), i("Öl", 15, "ml"),
                i("Koriander", 2, "EL")),
            List.of(s("Reis nach Packungsangabe garen."),
                s("Zwiebeln, Knoblauch und Ingwer fein hacken."),
                s("Fleisch in Öl scharf anbraten und herausnehmen.", 5),
                s("Zwiebeln anbraten, Knoblauch, Ingwer, Currypulver und Tomatenmark kurz mitrösten."),
                s("Mit Tomaten und Kokosmilch ablöschen, Fleisch zurückgeben und köcheln lassen.", 20),
                s("Joghurt unterrühren, abschmecken und mit Reis und Koriander servieren."))),

        r("Fleischbällchen-Bolognese mit Spaghetti", "1551183053-bf91a1d81141", 35, 2, "fleisch,italienisch,familie",
            "Saftige Hackbällchen in fruchtiger Tomatensauce auf Spaghetti.",
            List.of(i("Rinderhack", 300), i("Eier", 1, "Stk."), i("Paniermehl", 30), i("Zwiebel", 1, "Stk."),
                i("Knoblauch", 2, "Stk."), i("Passierte Tomaten", 400), i("Tomatenmark", 1, "EL"),
                i("Möhren", 1, "Stk."), i("Italienische Kräuter", 1, "TL"), i("Spaghetti", 200),
                i("Parmesan", 20), i("Olivenöl", 15, "ml")),
            List.of(s("Hack mit Ei, Paniermehl, der Hälfte der gewürfelten Zwiebel, Salz und Pfeffer verkneten und kleine Bällchen formen."),
                s("Bällchen in Olivenöl rundum anbraten und herausnehmen.", 6),
                s("Restliche Zwiebel, Knoblauch und geraspelte Möhre anschwitzen, Tomatenmark einrühren, Tomaten und Kräuter zugeben."),
                s("Bällchen in die Sauce geben und köcheln lassen.", 15),
                s("Spaghetti in Salzwasser bissfest kochen.", 9),
                s("Spaghetti mit Sauce und Bällchen anrichten und mit Parmesan bestreuen."))),

        r("Rindergeschnetzeltes in Pfeffersauce", "1504674900247-0877df9cc836", 25, 2, "fleisch,cremig,schnell",
            "Zartes Geschnetzeltes in cremiger Sauce mit grünen Pfefferkörnern, dazu Reis.",
            List.of(i("Rindergeschnetzeltes", 350), i("Zwiebel", 1, "Stk."), i("Pfefferkörner (grün)", 1, "EL"),
                i("Sahne", 150, "ml"), i("Rinderbrühe", 100, "ml"), i("Senf", 1, "TL"), i("Champignons", 150),
                i("Reis", 150), i("Öl", 15, "ml")),
            List.of(s("Reis nach Packungsangabe garen."),
                s("Zwiebel würfeln, Champignons in Scheiben schneiden."),
                s("Fleisch in heißem Öl in zwei Portionen scharf anbraten und herausnehmen.", 5),
                s("Zwiebel und Champignons anbraten, Senf und Pfefferkörner zugeben."),
                s("Mit Brühe und Sahne ablöschen und cremig einkochen.", 5),
                s("Fleisch zugeben, kurz erwärmen, abschmecken und mit Reis servieren."))),

        r("Fleischbällchen-Suppe", "1547592166-23ac45744acd", 35, 4, "suppe,fleisch,familie",
            "Herzhafte Gemüsesuppe mit Hackbällchen, Kartoffeln und Suppennudeln.",
            List.of(i("Rinderhack", 400), i("Eier", 1, "Stk."), i("Paniermehl", 30), i("Zwiebel", 1, "Stk."),
                i("Möhren", 2, "Stk."), i("Lauch", 1, "Stk."), i("Kartoffeln", 300), i("Gemüsebrühe", 1200, "ml"),
                i("Suppennudeln", 80), i("Petersilie", 2, "EL"), i("Senf", 1, "TL"), i("Öl", 15, "ml")),
            List.of(s("Hack mit Ei, Paniermehl, Senf, Salz und Pfeffer verkneten und kleine Bällchen formen."),
                s("Zwiebel würfeln, Möhren, Lauch und Kartoffeln klein schneiden."),
                s("Zwiebel in Öl anschwitzen, Gemüse zugeben und mit Brühe aufgießen. Zum Kochen bringen."),
                s("Hackbällchen in die Brühe geben und leise köcheln lassen.", 12),
                s("Suppennudeln zufügen und garen.", 8),
                s("Mit Salz, Pfeffer und Petersilie abschmecken."))),

        r("Tomatensuppe mit Pizza-Brötchen", "1547592166-23ac45744acd", 40, 2, "suppe,vegetarisch,familie",
            "Fruchtige Tomatensuppe mit überbackenen Pizza-Brötchen zum Eintunken.",
            List.of(i("Passierte Tomaten", 600), i("Zwiebel", 1, "Stk."), i("Knoblauch", 1, "Stk."),
                i("Gemüsebrühe", 300, "ml"), i("Sahne", 100, "ml"), i("Tomatenmark", 1, "EL"), i("Zucker", 1, "TL"),
                i("Basilikum", 1, "EL"), i("Olivenöl", 15, "ml"), i("Brötchen", 4, "Stk."),
                i("Mozzarella", 125), i("Italienische Kräuter", 1, "TL")),
            List.of(s("Ofen auf 200 °C vorheizen. Brötchen halbieren und mit etwas Tomatensauce bestreichen, mit Mozzarella und Kräutern belegen."),
                s("Pizza-Brötchen im Ofen goldbraun überbacken.", 12),
                s("Zwiebel und Knoblauch würfeln und in Olivenöl glasig dünsten, Tomatenmark kurz mitrösten."),
                s("Passierte Tomaten, Brühe und Zucker zugeben und köcheln lassen.", 15),
                s("Sahne einrühren, mit Salz, Pfeffer und Basilikum abschmecken."),
                s("Suppe mit den Pizza-Brötchen servieren."))),

        r("Gemüse-Hähnchen-Curry", "1455619452474-d2be8b1e70cd", 30, 2, "fleisch,curry,gemüse",
            "Cremiges Curry mit Hähnchen und buntem Gemüse auf Basmatireis.",
            List.of(i("Hähnchenbrust", 300), i("Zucchini", 1, "Stk."), i("Paprika", 1, "Stk."), i("Brokkoli", 200),
                i("Möhren", 1, "Stk."), i("Zwiebel", 1, "Stk."), i("Knoblauch", 2, "Stk."), i("Kokosmilch", 200, "ml"),
                i("Currypulver", 2, "TL"), i("Tomatenmark", 1, "EL"), i("Gemüsebrühe", 100, "ml"),
                i("Basmatireis", 150), i("Öl", 15, "ml")),
            List.of(s("Reis nach Packungsangabe garen."),
                s("Hähnchen würfeln, Gemüse in mundgerechte Stücke schneiden."),
                s("Hähnchen in Öl anbraten, Zwiebel und Knoblauch zugeben.", 5),
                s("Currypulver und Tomatenmark einrühren, mit Kokosmilch und Brühe ablöschen."),
                s("Möhren, Paprika, Brokkoli und Zucchini zugeben und köcheln lassen, bis das Gemüse bissfest ist.", 12),
                s("Abschmecken und mit dem Reis servieren."))),

        r("Ofenlachs mit Tomaten und Zucchini", "1574484284002-952d92456975", 15, 4, "fisch,ofen,low-carb",
            "Zarter Lachs mit Zucchini und Kirschtomaten vom Blech, mit Honig-Senf-Dill-Marinade.",
            List.of(i("Lachsfilet", 600), i("Zucchini", 2, "Stk."), i("Kirschtomaten", 250), i("Olivenöl", 30, "ml"),
                i("Dill", 1, "EL"), i("Senf", 1, "TL"), i("Honig", 1, "TL"), i("Zitrone", 1, "Stk.")),
            List.of(s("Backofen auf 180 °C Ober-/Unterhitze vorheizen. Zucchini in dünne Scheiben schneiden."),
                s("Aus Olivenöl, Dill, Senf, Honig, Zitronensaft, Salz und Pfeffer eine Marinade anrühren."),
                s("Zucchini, Lachsfilets und Tomaten auf ein mit Backpapier belegtes Blech geben und mit der Marinade beträufeln."),
                s("Im vorgeheizten Ofen backen (bei kleineren Filets den Lachs erst nach etwa 10–15 Minuten zum Gemüse legen).", 25))),

        r("Lasagne", "1563379926898-05f4575a45d8", 75, 4, "fleisch,ofen,familie",
            "Klassische Lasagne mit Hackfleisch-Tomatensauce, Béchamel und Käse.",
            List.of(i("Lasagneplatten", 250), i("Rinderhack", 500), i("Zwiebel", 1, "Stk."), i("Knoblauch", 2, "Stk."),
                i("Möhren", 1, "Stk."), i("Passierte Tomaten", 700), i("Tomatenmark", 2, "EL"), i("Butter", 40),
                i("Mehl", 40), i("Milch", 500, "ml"), i("Gouda", 150), i("Parmesan", 40),
                i("Italienische Kräuter", 1, "TL"), i("Olivenöl", 15, "ml")),
            List.of(s("Zwiebel, Knoblauch und Möhre fein würfeln und in Olivenöl anschwitzen. Hack zugeben und krümelig braten."),
                s("Tomatenmark, Passierte Tomaten und Kräuter zugeben und die Sauce köcheln lassen.", 20),
                s("Für die Béchamel Butter schmelzen, Mehl einrühren, mit Milch ablöschen und unter Rühren eindicken. Mit Salz und Muskat würzen."),
                s("Ofen auf 180 °C vorheizen. Auflaufform abwechselnd mit Sauce, Lasagneplatten und Béchamel schichten, mit Béchamel abschließen."),
                s("Mit Gouda und Parmesan bestreuen und im Ofen goldbraun backen.", 40),
                s("Vor dem Anschneiden kurz ruhen lassen.", 10))),

        r("Toast Hawaii", "1528735602780-2552fd46c7af", 15, 2, "klassiker,schnell,ofen",
            "Überbackener Toast mit Kochschinken, Ananas und geschmolzenem Käse.",
            List.of(i("Toastbrot", 4, "Stk."), i("Kochschinken", 100), i("Ananas (Dose)", 120), i("Gouda", 120),
                i("Butter", 20)),
            List.of(s("Backofen auf 200 °C Grillfunktion oder Oberhitze vorheizen."),
                s("Toastscheiben dünn mit Butter bestreichen und auf ein Blech legen."),
                s("Mit Schinken, Ananas und Käse belegen."),
                s("Im Ofen überbacken, bis der Käse goldbraun geschmolzen ist.", 8))),

        r("Gemüse-Reibe-Kuchen", "1518013431117-eb1465fa5752", 50, 4, "vegetarisch,ofen,familie",
            "Herzhafter Kuchen aus geraspeltem Gemüse, Eiern und Käse mit Kräuterquark.",
            List.of(i("Zucchini", 300), i("Möhren", 250), i("Kartoffeln", 250), i("Eier", 4, "Stk."), i("Mehl", 80),
                i("Gouda", 100), i("Zwiebel", 1, "Stk."), i("Backpulver", 1, "TL"), i("Milch", 100, "ml"),
                i("Petersilie", 2, "EL"), i("Kräuterquark", 250)),
            List.of(s("Ofen auf 180 °C vorheizen. Zucchini, Möhren und Kartoffeln raspeln, Zucchini gut ausdrücken. Zwiebel fein würfeln."),
                s("Eier mit Milch, Mehl, Backpulver, Salz, Pfeffer und Petersilie verrühren."),
                s("Gemüse, Zwiebel und Käse unterheben."),
                s("Teig in eine gefettete Form füllen und backen, bis die Oberfläche goldbraun ist.", 35),
                s("Kurz abkühlen lassen und mit Kräuterquark servieren."))),

        r("Hähnchenkeulen mit Kartoffeln", "1604908176997-125f25cc6f3d", 60, 2, "fleisch,ofen,deftig",
            "Knusprige Hähnchenkeulen mit Ofenkartoffeln, Knoblauch, Zitrone und Rosmarin.",
            List.of(i("Hähnchenkeulen", 800), i("Kartoffeln", 600), i("Olivenöl", 30, "ml"), i("Paprikapulver", 2, "TL"),
                i("Knoblauch", 2, "Stk."), i("Zitrone", 1, "Stk."), i("Rosmarin", 2, "Zweig(e)")),
            List.of(s("Ofen auf 200 °C Ober-/Unterhitze vorheizen."),
                s("Kartoffeln in Spalten schneiden. Hähnchenkeulen und Kartoffeln mit Olivenöl, Paprikapulver, Salz, Pfeffer, Knoblauch und Rosmarin vermengen."),
                s("Alles auf einem Blech verteilen und die Zitrone in Spalten dazulegen."),
                s("Im Ofen backen, nach der Hälfte der Zeit wenden.", 45),
                s("Kurz ruhen lassen und servieren.", 5))),

        r("Pizza-Brötchen mit Thunfisch, Lachs und Sprotten", "1565299624946-b28f40a0ae38", 25, 2, "fisch,ofen,schnell",
            "Überbackene Brötchen mit Tomatensauce, Käse und wahlweise Thunfisch, Räucherlachs oder Sprotten.",
            List.of(i("Brötchen", 4, "Stk."), i("Passierte Tomaten", 150), i("Gouda", 100), i("Thunfisch (Dose)", 80),
                i("Räucherlachs", 60), i("Sprotten", 60), i("Zwiebel", 1, "Stk."), i("Italienische Kräuter", 1, "TL")),
            List.of(s("Ofen auf 200 °C vorheizen. Brötchen halbieren."),
                s("Tomaten mit Kräutern, Salz und Pfeffer verrühren und auf die Brötchenhälften streichen."),
                s("Mit Zwiebelringen belegen und mit Thunfisch, Sprotten oder Räucherlachs toppen. Mit Käse bestreuen."),
                s("Im Ofen goldbraun überbacken.", 12),
                s("Räucherlachs erst nach dem Backen auf die fertigen Brötchen legen."))),

        r("Käse-Lauch-Suppe", "1547592166-23ac45744acd", 30, 4, "suppe,fleisch,cremig",
            "Cremige Suppe mit Lauch, Schmelzkäse und Hackfleisch (Hackfleisch kann entfallen).",
            List.of(i("Rinderhack", 300), i("Lauch", 2, "Stk."), i("Schmelzkäse", 200), i("Gemüsebrühe", 800, "ml"),
                i("Zwiebel", 1, "Stk."), i("Öl", 15, "ml")),
            List.of(s("Lauch in Ringe schneiden, Zwiebel würfeln."),
                s("Hack in Öl krümelig anbraten, Zwiebel und Lauch zugeben und mitbraten.", 8),
                s("Mit Brühe aufgießen und kochen, bis der Lauch weich ist.", 10),
                s("Schmelzkäse in Stücken einrühren und unter Rühren schmelzen lassen."),
                s("Mit Salz, Pfeffer und Muskat abschmecken."))),

        r("Kartoffelnester", "1518013431117-eb1465fa5752", 50, 2, "ofen,eier,herzhaft",
            "Knusprige Kartoffelnester aus der Muffinform mit Schinken, Käse und Ei.",
            List.of(i("Kartoffeln", 600), i("Eier", 5, "Stk."), i("Gouda", 100), i("Kochschinken", 80),
                i("Zwiebel", 1, "Stk."), i("Schnittlauch", 1, "EL")),
            List.of(s("Ofen auf 200 °C vorheizen. Kartoffeln schälen, grob raspeln und gut ausdrücken."),
                s("Kartoffeln mit einem Ei, Zwiebelwürfeln, Schinken, der Hälfte des Käses, Salz und Pfeffer vermengen."),
                s("Muffinform fetten, die Masse hineindrücken und in der Mitte Mulden formen. Im Ofen vorbacken.", 20),
                s("Je ein Ei in die Mulden schlagen, mit restlichem Käse bestreuen und weiterbacken, bis das Eiweiß gestockt ist.", 10),
                s("Mit Schnittlauch bestreuen und servieren."))),

        r("Buttergemüse mit Ei", "1482049016688-2d3e1b311543", 25, 2, "vegetarisch,schnell,eier",
            "Zartes Möhren-Kohlrabi-Erbsen-Gemüse in Butter, dazu Spiegeleier und Salzkartoffeln.",
            List.of(i("Möhren", 250), i("Kohlrabi", 1, "Stk."), i("Erbsen", 150), i("Butter", 30), i("Zucker", 1, "TL"),
                i("Petersilie", 1, "EL"), i("Eier", 4, "Stk."), i("Kartoffeln", 400)),
            List.of(s("Kartoffeln schälen, in Salzwasser garen.", 18),
                s("Möhren und Kohlrabi schälen und in Stifte schneiden."),
                s("Butter im Topf schmelzen, Möhren und Kohlrabi mit Zucker kurz anschwitzen und mit wenig Wasser zugedeckt dünsten.", 8),
                s("Erbsen zugeben und ein paar Minuten mitgaren. Mit Salz, Pfeffer und Muskat abschmecken.", 3),
                s("Eier als Spiegeleier braten."),
                s("Gemüse mit Kartoffeln, Ei und Petersilie anrichten."))),

        r("Gnocchi-Brokkoli-Auflauf", "1585032226651-759b368d7246", 15, 4, "ofen,familie,schnell",
            "Cremiger Auflauf mit Gnocchi, Brokkoli, Kochschinken und Käsekruste.",
            List.of(i("Brokkoli", 450), i("Kochschinken", 100), i("Gnocchi", 500), i("Sahne", 250, "ml"),
                i("Frischkäse", 150), i("Senf", 1, "TL"), i("Gouda", 150)),
            List.of(s("Backofen auf 200 °C Ober-/Unterhitze vorheizen. Brokkoli in Röschen teilen und Schinken würfeln."),
                s("Brokkoli und Gnocchi in kochendem Salzwasser vorkochen, abgießen und mit dem Schinken in eine Auflaufform geben.", 3),
                s("Sahne, Frischkäse und Senf verrühren und mit Salz, Pfeffer und Muskat würzen."),
                s("Sauce in der Form verteilen, alles vermengen und mit dem Käse bestreuen."),
                s("Im Ofen backen, bis die Oberfläche goldbraun ist.", 20))),

        r("Wikinger-Eintopf", "1529042410759-befb1204b468", 30, 4, "fleisch,eintopf,one-pot",
            "Saftige Hackbällchen mit Erbsen und Möhren in cremiger Sauce – alles aus einer Pfanne.",
            List.of(i("Rinderhack", 500), i("Paniermehl", 2, "EL"), i("Eier", 1, "Stk."), i("Senf", 1, "TL"),
                i("Zwiebel", 1, "Stk."), i("Butter", 15), i("Gemüsebrühe", 250, "ml"), i("Sahne", 250, "ml"),
                i("Frischkäse", 20), i("Erbsen-Möhren-Mix (TK)", 500)),
            List.of(s("Hackfleisch mit Paniermehl, Ei, Senf, Salz und Pfeffer mischen und etwa 16 Bällchen formen. Zwiebel fein hacken."),
                s("Butter in einer großen Pfanne erhitzen und die Hackbällchen von allen Seiten kräftig anbraten, dann die Zwiebel kurz mitbraten.", 10),
                s("Brühe, Sahne und Frischkäse unterrühren, Erbsen und Möhren zugeben und alles köcheln lassen. Bei Bedarf etwas Brühe nachgießen.", 10),
                s("Mit Salz und Pfeffer abschmecken und mit Nudeln, Reis oder Kartoffelpüree servieren."))),

        r("Bratreis", "1603133872878-684f208fb84b", 15, 2, "vegetarisch,schnell,asiatisch",
            "Knuspriger Bratreis mit Ei, Möhren, Erbsen und Frühlingszwiebeln.",
            List.of(i("Reis", 200), i("Butter", 30), i("Knoblauch", 1, "Stk."), i("Möhren", 2, "Stk."),
                i("Eier", 3, "Stk."), i("Erbsen", 100), i("Sojasauce", 4, "EL"), i("Frühlingszwiebeln", 3, "Stk."),
                i("Fischsauce", 1, "TL")),
            List.of(s("Reis kochen (ergibt etwa 600 g gekochten Reis) und am besten vorher abkühlen lassen.", 12),
                s("Knoblauch fein hacken, Möhren schälen und klein würfeln."),
                s("Butter in einer großen Pfanne schmelzen, den kalten Reis zugeben und unter gelegentlichem Rühren braten, dann Möhren und Knoblauch zugeben.", 8),
                s("Reis an den Pfannenrand schieben, Eier in die Mitte schlagen und rühren, bis sie gestockt sind."),
                s("Reis und Rührei vermischen, Erbsen und Frühlingszwiebeln zugeben und kurz garen.", 1),
                s("Mit Sojasauce und Fischsauce abschmecken."))),

        r("Hähnchen-Paprika-Pfanne", "1604908176997-125f25cc6f3d", 20, 4, "fleisch,pfanne,schnell",
            "Zartes Hähnchen mit Paprika und Tomaten in cremiger Basilikum-Sauce – in 20 Minuten fertig.",
            List.of(i("Hähnchenbrust", 400), i("Paprika", 1, "Stk."), i("Tomaten", 2, "Stk."), i("Knoblauch", 1, "Stk."),
                i("Olivenöl", 15, "ml"), i("Sahne", 250, "ml"), i("Tomatenmark", 2, "EL"), i("Gemüsebrühe", 1, "TL"),
                i("Basilikum", 2, "EL")),
            List.of(s("Hähnchen, Paprika und Tomaten in kleine Stücke schneiden, Knoblauch hacken."),
                s("Olivenöl erhitzen und das Hähnchen kräftig anbraten, mit Salz und Pfeffer würzen. Paprika und Knoblauch zugeben und kurz mitbraten.", 5),
                s("Sahne, Tomatenmark und Gemüsebrühpulver verrühren, mit Basilikum und Tomaten in die Pfanne geben und aufkochen."),
                s("Mit Salz und Pfeffer abschmecken und mit Reis oder Nudeln servieren."))),

        r("Hackbällchen Toskana", "1529042410759-befb1204b468", 15, 4, "fleisch,ofen,italienisch",
            "Saftige Hackbällchen in cremiger Tomaten-Sahne-Sauce mit Mozzarella überbacken.",
            List.of(i("Hackfleisch gemischt", 500), i("Senf", 1, "TL"), i("Italienische Kräuter", 4, "EL"),
                i("Gehackte Tomaten (Dose)", 400), i("Sahne", 100, "ml"), i("Tomatenmark", 2, "EL"),
                i("Zucker", 1, "TL"), i("Mozzarella", 125)),
            List.of(s("Ofen auf 175 °C Umluft vorheizen und eine kleine Auflaufform bereitstellen."),
                s("Hack mit Senf, 1 EL italienischen Kräutern, Salz und Pfeffer vermischen, etwa 12 gleich große Bällchen formen und in die Form setzen."),
                s("Gehackte Tomaten, Sahne, Tomatenmark, Zucker und 3 EL Kräuter verrühren, mit Salz und Pfeffer abschmecken und über die Bällchen gießen. Mozzarella in Scheiben darauflegen."),
                s("Backen, bis die Bällchen gar sind und der Käse goldbraun und knusprig ist.", 35),
                s("Mit Reis, Nudeln oder Ciabatta zum Aufstippen der Sauce servieren."))),

        r("Süßkartoffel-Curry mit Kokosmilch", "1455619452474-d2be8b1e70cd", 20, 4, "vegan,curry,vegetarisch",
            "Cremiges Curry aus Süßkartoffeln und Brokkoli mit gelber Currypaste, Koriander und Erdnüssen.",
            List.of(i("Süßkartoffel", 500), i("Brokkoli", 400), i("Kokosöl", 5, "ml"), i("Currypaste", 2, "EL"),
                i("Kokosmilch", 800, "ml"), i("Koriander", 2, "EL"), i("Erdnüsse", 30)),
            List.of(s("Süßkartoffel schälen und klein würfeln, Brokkoli in Röschen teilen."),
                s("Kokosöl in einer großen Pfanne erhitzen, Currypaste einrühren, Kokosmilch zugeben und aufkochen."),
                s("Süßkartoffelwürfel zugeben und köcheln lassen.", 10),
                s("Brokkoli zugeben und weiterköcheln.", 5),
                s("Mit Koriander und gehackten Erdnüssen bestreut servieren, dazu passt Reis."))),

        r("Griechischer Bauernsalat", "1511690656952-34342bb7c2f2", 15, 4, "vegetarisch,salat,schnell",
            "Knackiger Salat mit Tomate, Gurke, Paprika, Oliven und Schafskäse in Zitronen-Olivenöl-Dressing.",
            List.of(i("Salatgurke", 1, "Stk."), i("Paprika", 2, "Stk."), i("Tomaten", 500), i("Zwiebel", 2, "Stk."),
                i("Schafskäse", 200), i("Oregano", 1, "TL"), i("Oliven", 100), i("Olivenöl", 125, "ml"),
                i("Zitrone", 1, "Stk.")),
            List.of(s("Gurke ungeschält in dünne Scheiben schneiden. Paprika in Streifen, Tomaten in Achtel und Zwiebeln in feine Ringe schneiden."),
                s("Gemüse mit den abgetropften Oliven in eine Schüssel geben."),
                s("Olivenöl, Zitronensaft, Salz und Pfeffer zu einem Dressing verrühren, kurz vor dem Servieren über den Salat geben und umrühren."),
                s("Schafskäse würfeln, mit Oregano bestreuen und zuletzt auf den Salat geben.")))
    );

    private RomansPlanSeedData() {
    }

    private static void n(String name, double kcalPer100, double proteinPer100) {
        NUTRITION.put(name, new double[] {kcalPer100, proteinPer100});
    }

    private static IngredientData i(String name, double quantity) {
        return i(name, quantity, "g");
    }

    private static IngredientData i(String name, double quantity, String unit) {
        double[] values = NUTRITION.get(name);
        if (values == null) {
            throw new IllegalStateException("Keine Nährwerte hinterlegt für " + name);
        }
        return new IngredientData(name, quantity, unit, values[0], values[1]);
    }

    private static StepData s(String text) {
        return new StepData(text, null);
    }

    private static StepData s(String text, int minutes) {
        return new StepData(text, minutes * 60);
    }

    private static RecipeData r(
            String name, String photoId, int prepMinutes, int servings, String tags, String description,
            List<IngredientData> ingredients, List<StepData> steps) {
        return new RecipeData(name, photoId, prepMinutes, servings, "romansplan," + tags, description, ingredients, steps);
    }

    record RecipeData(
            String name, String photoId, int prepMinutes, int servings, String tags, String description,
            List<IngredientData> ingredients, List<StepData> steps) {
        String imageUrl() {
            return "https://images.unsplash.com/photo-" + photoId + "?auto=format&fit=crop&w=900&q=80";
        }
    }

    record IngredientData(String name, double quantity, String unit, double kcalPer100, double proteinPer100) {
    }

    record StepData(String text, Integer timerSeconds) {
    }
}
