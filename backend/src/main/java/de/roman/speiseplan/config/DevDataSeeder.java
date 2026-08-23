package de.roman.speiseplan.config;

import de.roman.speiseplan.creator.Creator;
import de.roman.speiseplan.creator.CreatorRepository;
import de.roman.speiseplan.dish.Dish;
import de.roman.speiseplan.dish.DishIngredient;
import de.roman.speiseplan.dish.DishIngredientRepository;
import de.roman.speiseplan.dish.DishRepository;
import de.roman.speiseplan.dish.Ingredient;
import de.roman.speiseplan.dish.IngredientRepository;
import de.roman.speiseplan.dish.PrepStep;
import de.roman.speiseplan.dish.PrepStepRepository;
import de.roman.speiseplan.plan.MealPlan;
import de.roman.speiseplan.plan.MealPlanRepository;
import de.roman.speiseplan.plan.PlanEntry;
import de.roman.speiseplan.plan.PlanEntryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import java.util.ArrayList;
import java.util.List;

@Configuration
@Profile("dev")
public class DevDataSeeder {
    @Bean
    CommandLineRunner seedDemoData(
            CreatorRepository creatorRepository,
            MealPlanRepository mealPlanRepository,
            DishRepository dishRepository,
            PlanEntryRepository planEntryRepository,
            IngredientRepository ingredientRepository,
            DishIngredientRepository dishIngredientRepository,
            PrepStepRepository prepStepRepository) {
        return arguments -> {
            if (mealPlanRepository.count() > 0) {
                return;
            }

            MealPlan weekPlan = mealPlanRepository.save(new MealPlan("Diese Woche"));
            MealPlan quickPlan = mealPlanRepository.save(new MealPlan("Schnelle Küche"));

            Dish pasta = new Dish(
                    "Pasta mit Tomaten",
                    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80");
            pasta.setDescription("Schnelle Pasta mit frischer Tomatensauce.");
            pasta.setPrepMinutes(20);
            pasta.setServings(2);
            pasta.setTags("schnell,vegetarisch");
            pasta = dishRepository.save(pasta);

            Ingredient nudeln = ingredientRepository.save(new Ingredient("Nudeln", 131, 5, "g"));
            Ingredient tomaten = ingredientRepository.save(new Ingredient("Tomaten", 18, 0.9, "g"));
            Ingredient parmesan = ingredientRepository.save(new Ingredient("Parmesan", 392, 35, "g"));

            dishIngredientRepository.save(new DishIngredient(pasta, nudeln, 250));
            dishIngredientRepository.save(new DishIngredient(pasta, tomaten, 400));
            dishIngredientRepository.save(new DishIngredient(pasta, parmesan, 40));

            prepStepRepository.save(new PrepStep(pasta, 0, "Wasser salzen und aufkochen, Nudeln darin garen.", 600));
            prepStepRepository.save(new PrepStep(pasta, 1, "Tomaten klein schneiden und in Öl anschwitzen.", 300));
            prepStepRepository.save(new PrepStep(pasta, 2, "Nudeln mit der Sauce mischen und mit Parmesan servieren.", null));

            planEntryRepository.save(new PlanEntry(weekPlan, pasta, 0));
            planEntryRepository.save(new PlanEntry(quickPlan, pasta, 0));

                List<RecipeSeed> weekRecipes = List.of(
                    recipe("Spaghetti Bolognese", "Herzhafter Familienklassiker mit Rinderhack und Tomaten.", 24,
                        ingredient("Spaghetti", 350, 131, 5), ingredient("Rinderhack", 500, 250, 26),
                        ingredient("Passierte Tomaten", 500, 29, 1.4), ingredient("Zwiebel", 1, 40, 1.1, "Stk.")),
                    recipe("Hähnchen-Gemüse-Pfanne", "Bunte Pfanne mit zartem Hähnchen und mildem Gemüse.", 20,
                        ingredient("Hähnchenbrust", 500, 110, 23), ingredient("Paprika", 2, 31, 1, "Stk."),
                        ingredient("Zucchini", 1, 17, 1.2, "Stk."), ingredient("Reis", 300, 350, 7)),
                    recipe("Kartoffel-Möhren-Puffer", "Knusprige Gemüse-Puffer mit Kräuterquark.", 24,
                        ingredient("Kartoffeln", 700, 77, 2), ingredient("Möhren", 300, 41, 0.9),
                        ingredient("Eier", 2, 143, 13, "Stk."), ingredient("Kräuterquark", 250, 110, 7)),
                    recipe("Cremige Schinken-Nudeln", "Cremige Nudeln mit Erbsen und Kochschinken.", 18,
                        ingredient("Fusilli", 400, 131, 5), ingredient("Kochschinken", 200, 116, 20),
                        ingredient("Erbsen", 200, 81, 5), ingredient("Sahne", 200, 292, 2.1, "ml")),
                    recipe("Fischstäbchen mit Kartoffelstampf", "Kinderliebling mit cremigem Stampf und Gurkensalat.", 24,
                        ingredient("Fischstäbchen", 12, 220, 12, "Stk."), ingredient("Kartoffeln", 800, 77, 2),
                        ingredient("Milch", 150, 47, 3.4, "ml"), ingredient("Gurke", 1, 15, 0.7, "Stk.")),
                    recipe("Tortellini in Tomaten-Sahne", "Gefüllte Pasta in einer milden, cremigen Sauce.", 15,
                        ingredient("Tortellini", 600, 240, 9), ingredient("Passierte Tomaten", 400, 29, 1.4),
                        ingredient("Sahne", 150, 292, 2.1, "ml"), ingredient("Mozzarella", 125, 280, 18)),
                    recipe("Hackbällchen in Paprikasauce", "Saftige Hackbällchen mit milder Paprikasauce.", 24,
                        ingredient("Rinderhack", 500, 250, 26), ingredient("Paprika", 2, 31, 1, "Stk."),
                        ingredient("Passierte Tomaten", 400, 29, 1.4), ingredient("Couscous", 300, 376, 13)),
                    recipe("Käsespätzle mit Röstzwiebeln", "Schnelle, würzige Spätzle für die ganze Familie.", 20,
                        ingredient("Spätzle", 600, 150, 5), ingredient("Bergkäse", 250, 384, 27),
                        ingredient("Zwiebeln", 2, 40, 1.1, "Stk."), ingredient("Sahne", 100, 292, 2.1, "ml")),
                    recipe("Mildes Chili con Carne", "Familienfreundliches Chili ohne scharfe Gewürze.", 22,
                        ingredient("Rinderhack", 400, 250, 26), ingredient("Kidneybohnen", 240, 110, 8),
                        ingredient("Mais", 200, 86, 3.2), ingredient("Passierte Tomaten", 500, 29, 1.4)),
                    recipe("Gnocchi-Spinat-Pfanne", "Cremige Gnocchi mit Blattspinat und Frischkäse.", 18,
                        ingredient("Gnocchi", 600, 150, 4), ingredient("Blattspinat", 300, 23, 2.9),
                        ingredient("Frischkäse", 200, 225, 6), ingredient("Kirschtomaten", 250, 18, 0.9)));

                List<RecipeSeed> quickRecipes = List.of(
                    recipe("Pfannkuchen mit Apfelmus", "Lockere Pfannkuchen, süß oder herzhaft servierbar.", 20,
                        ingredient("Mehl", 300, 364, 10), ingredient("Milch", 500, 47, 3.4, "ml"),
                        ingredient("Eier", 4, 143, 13, "Stk."), ingredient("Apfelmus", 300, 68, 0.2)),
                    recipe("Pizza-Toast", "Knusprige Toasts mit Tomate, Schinken und Käse.", 15,
                        ingredient("Toastbrot", 8, 265, 9, "Stk."), ingredient("Kochschinken", 150, 116, 20),
                        ingredient("Passierte Tomaten", 200, 29, 1.4), ingredient("Gouda", 200, 356, 25)),
                    recipe("Gebratener Reis mit Ei", "Schnelles Pfannengericht mit Gemüse und Ei.", 18,
                        ingredient("Reis", 300, 350, 7), ingredient("Eier", 4, 143, 13, "Stk."),
                        ingredient("Erbsen", 200, 81, 5), ingredient("Möhren", 200, 41, 0.9)),
                    recipe("Wraps mit Hähnchen", "Weiche Wraps zum gemeinsamen Füllen am Familientisch.", 20,
                        ingredient("Tortilla-Wraps", 8, 310, 8, "Stk."), ingredient("Hähnchenbrust", 400, 110, 23),
                        ingredient("Salat", 1, 14, 1.4, "Stk."), ingredient("Joghurt", 200, 63, 5)),
                    recipe("Tomaten-Mozzarella-Couscous", "Leichter Couscous mit Tomaten, Mozzarella und Kräutern.", 15,
                        ingredient("Couscous", 300, 376, 13), ingredient("Kirschtomaten", 300, 18, 0.9),
                        ingredient("Mozzarella", 250, 280, 18), ingredient("Gurke", 1, 15, 0.7, "Stk.")),
                    recipe("Würstchen-Kartoffel-Pfanne", "Deftige Pfanne mit Würstchen und vorgegarten Kartoffeln.", 20,
                        ingredient("Wiener Würstchen", 6, 301, 12, "Stk."), ingredient("Kartoffeln", 700, 77, 2),
                        ingredient("Paprika", 2, 31, 1, "Stk."), ingredient("Zwiebel", 1, 40, 1.1, "Stk.")),
                    recipe("Brokkoli-Käse-Nudeln", "Cremige Nudeln mit Brokkoli und mildem Käse.", 20,
                        ingredient("Penne", 400, 131, 5), ingredient("Brokkoli", 400, 34, 2.8),
                        ingredient("Frischkäse", 200, 225, 6), ingredient("Gouda", 100, 356, 25)),
                    recipe("Flammkuchen-Wraps", "Dünne, knusprige Wraps mit cremigem Schinkenbelag.", 15,
                        ingredient("Tortilla-Wraps", 8, 310, 8, "Stk."), ingredient("Schmand", 200, 240, 2.4),
                        ingredient("Kochschinken", 150, 116, 20), ingredient("Frühlingszwiebeln", 3, 32, 1.8, "Stk.")),
                    recipe("Maultaschen-Gemüse-Pfanne", "Gebratene Maultaschen mit buntem Gemüse.", 18,
                        ingredient("Maultaschen", 600, 200, 9), ingredient("Zucchini", 1, 17, 1.2, "Stk."),
                        ingredient("Paprika", 2, 31, 1, "Stk."), ingredient("Kirschtomaten", 250, 18, 0.9)),
                    recipe("Schnelle Kartoffelsuppe", "Cremige Kartoffelsuppe mit Möhren und Würstchen.", 24,
                        ingredient("Kartoffeln", 700, 77, 2), ingredient("Möhren", 300, 41, 0.9),
                        ingredient("Gemüsebrühe", 800, 5, 0.2, "ml"), ingredient("Wiener Würstchen", 4, 301, 12, "Stk.")));

                List<Dish> weekDishes = seedRecipes(weekPlan, 1, weekRecipes, dishRepository, planEntryRepository,
                    ingredientRepository, dishIngredientRepository, prepStepRepository);
                List<Dish> quickDishes = seedRecipes(quickPlan, 1, quickRecipes, dishRepository, planEntryRepository,
                    ingredientRepository, dishIngredientRepository, prepStepRepository);

                Creator mia = creatorRepository.save(new Creator(
                    "Mia Sommer", "miasfamilienkueche",
                    "Schnelle Wohlfühlküche für volle Familientage.",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=85",
                    "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1000&q=85"));
                Creator jonas = creatorRepository.save(new Creator(
                    "Jonas Feld", "jonaskochtfix",
                    "Einfaches Feierabendessen, das Kindern und Eltern schmeckt.",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=85",
                    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=85"));
                Creator aylin = creatorRepository.save(new Creator(
                    "Aylin Kaya", "familientisch",
                    "Bunte Familiengerichte mit wenigen Zutaten und viel Geschmack.",
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=85",
                    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85"));

                seedCreatorPlan("Mias Feierabend-Favoriten", mia,
                    List.of(weekDishes.get(0), weekDishes.get(2), weekDishes.get(5), weekDishes.get(9)),
                    mealPlanRepository, planEntryRepository);
                seedCreatorPlan("Jonas' 20-Minuten-Hits", jonas,
                    List.of(quickDishes.get(1), quickDishes.get(2), quickDishes.get(6), quickDishes.get(8)),
                    mealPlanRepository, planEntryRepository);
                seedCreatorPlan("Aylins bunter Familientisch", aylin,
                    List.of(weekDishes.get(3), quickDishes.get(3), quickDishes.get(4), quickDishes.get(9)),
                    mealPlanRepository, planEntryRepository);
        };
    }

            private List<Dish> seedRecipes(
                MealPlan plan,
                int firstSortOrder,
                List<RecipeSeed> recipes,
                DishRepository dishRepository,
                PlanEntryRepository planEntryRepository,
                IngredientRepository ingredientRepository,
                DishIngredientRepository dishIngredientRepository,
                PrepStepRepository prepStepRepository) {
            List<Dish> dishes = new ArrayList<>();
            for (int index = 0; index < recipes.size(); index++) {
                RecipeSeed seed = recipes.get(index);
                Dish dish = new Dish(seed.name(), imageUrl(seed.name()));
                dish.setDescription(seed.description());
                dish.setPrepMinutes(seed.prepMinutes());
                dish.setServings(4);
                dish.setTags("familie,schnell,beliebt");
                dish = dishRepository.save(dish);

                for (IngredientSeed ingredientSeed : seed.ingredients()) {
                Ingredient ingredient = ingredientRepository.save(new Ingredient(
                    ingredientSeed.name(), ingredientSeed.kcalPer100(),
                    ingredientSeed.proteinPer100(), ingredientSeed.unit()));
                dishIngredientRepository.save(new DishIngredient(dish, ingredient, ingredientSeed.quantity()));
                }

                    List<String> instructions = instructionsFor(seed.name());
                    for (int step = 0; step < instructions.size(); step++) {
                    Integer timerSeconds = step == instructions.size() - 1
                        ? null
                        : Math.max(180, seed.prepMinutes() * 60 / instructions.size());
                    prepStepRepository.save(new PrepStep(dish, step, instructions.get(step), timerSeconds));
                    }
                planEntryRepository.save(new PlanEntry(plan, dish, firstSortOrder + index));
                dishes.add(dish);
            }
            return dishes;
            }

            private void seedCreatorPlan(
                String name,
                Creator creator,
                List<Dish> dishes,
                MealPlanRepository mealPlanRepository,
                PlanEntryRepository planEntryRepository) {
            MealPlan plan = mealPlanRepository.save(new MealPlan(name, creator));
            for (int index = 0; index < dishes.size(); index++) {
                planEntryRepository.save(new PlanEntry(plan, dishes.get(index), index));
            }
            }

                private List<String> instructionsFor(String recipeName) {
                return switch (recipeName) {
                    case "Spaghetti Bolognese" -> List.of(
                        "Spaghetti in Salzwasser bissfest kochen.",
                        "Zwiebel und Hackfleisch anbraten, Tomaten zugeben und zehn Minuten köcheln.",
                        "Sauce abschmecken und mit den Spaghetti servieren.");
                    case "Hähnchen-Gemüse-Pfanne" -> List.of(
                        "Reis nach Packungsangabe garen und das Gemüse klein schneiden.",
                        "Hähnchenwürfel kräftig anbraten, Paprika und Zucchini zugeben.",
                        "Gemüse bissfest garen, würzen und mit dem Reis anrichten.");
                    case "Kartoffel-Möhren-Puffer" -> List.of(
                        "Kartoffeln und Möhren grob raspeln, ausdrücken und mit den Eiern mischen.",
                        "Kleine Puffer formen und portionsweise von beiden Seiten goldbraun braten.",
                        "Mit Kräuterquark servieren.");
                    case "Cremige Schinken-Nudeln" -> List.of(
                        "Nudeln bissfest kochen und die Erbsen in den letzten Minuten mitgaren.",
                        "Schinken anbraten, Sahne zugießen und kurz einkochen lassen.",
                        "Nudeln und Erbsen unterheben, mild würzen und servieren.");
                    case "Fischstäbchen mit Kartoffelstampf" -> List.of(
                        "Kartoffeln weich kochen und die Fischstäbchen knusprig braten.",
                        "Kartoffeln mit warmer Milch zu einem cremigen Stampf zerdrücken.",
                        "Gurke in Scheiben schneiden und alles zusammen servieren.");
                    case "Tortellini in Tomaten-Sahne" -> List.of(
                        "Tortellini nach Packungsangabe garen.",
                        "Tomaten und Sahne aufkochen, würzen und den Mozzarella einrühren.",
                        "Tortellini in der Sauce schwenken und direkt servieren.");
                    case "Hackbällchen in Paprikasauce" -> List.of(
                        "Hackfleisch würzen, kleine Bällchen formen und rundherum anbraten.",
                        "Paprika zugeben, mit Tomaten ablöschen und zehn Minuten köcheln.",
                        "Couscous quellen lassen und mit den Hackbällchen anrichten.");
                    case "Käsespätzle mit Röstzwiebeln" -> List.of(
                        "Zwiebeln in feine Ringe schneiden und goldbraun braten.",
                        "Spätzle erhitzen, Sahne und Käse unterheben und schmelzen lassen.",
                        "Mit den Röstzwiebeln bestreuen und servieren.");
                    case "Mildes Chili con Carne" -> List.of(
                        "Hackfleisch krümelig anbraten.",
                        "Tomaten, Bohnen und Mais zugeben und 15 Minuten sanft köcheln.",
                        "Mild mit Paprika, Salz und etwas Kreuzkümmel abschmecken.");
                    case "Gnocchi-Spinat-Pfanne" -> List.of(
                        "Gnocchi in einer großen Pfanne goldbraun braten.",
                        "Spinat und Tomaten zugeben, dann den Frischkäse einrühren.",
                        "Kurz cremig einkochen, abschmecken und servieren.");
                    case "Pfannkuchen mit Apfelmus" -> List.of(
                        "Mehl, Milch und Eier zu einem glatten Teig verrühren.",
                        "Den Teig portionsweise in einer beschichteten Pfanne ausbacken.",
                        "Pfannkuchen warm mit Apfelmus servieren.");
                    case "Pizza-Toast" -> List.of(
                        "Toastbrote auf ein Blech legen und dünn mit Tomaten bestreichen.",
                        "Mit Schinken und Käse belegen und würzen.",
                        "Bei 220 Grad etwa zehn Minuten knusprig backen.");
                    case "Gebratener Reis mit Ei" -> List.of(
                        "Reis garen, abgießen und kurz ausdampfen lassen.",
                        "Möhren und Erbsen anbraten, Reis zugeben und die Eier einrühren.",
                        "Alles kräftig durchbraten und mild abschmecken.");
                    case "Wraps mit Hähnchen" -> List.of(
                        "Hähnchen in Streifen schneiden, würzen und vollständig durchbraten.",
                        "Salat schneiden und Joghurt mit Salz und Kräutern verrühren.",
                        "Wraps erwärmen, gemeinsam füllen und fest einrollen.");
                    case "Tomaten-Mozzarella-Couscous" -> List.of(
                        "Couscous mit heißem Salzwasser übergießen und quellen lassen.",
                        "Tomaten, Gurke und Mozzarella klein schneiden.",
                        "Alles unter den Couscous heben, würzen und servieren.");
                    case "Würstchen-Kartoffel-Pfanne" -> List.of(
                        "Vorgegarte Kartoffeln, Würstchen, Paprika und Zwiebel in Stücke schneiden.",
                        "Kartoffeln knusprig braten, dann Gemüse und Würstchen zugeben.",
                        "Alles durchgaren, mild würzen und heiß servieren.");
                    case "Brokkoli-Käse-Nudeln" -> List.of(
                        "Nudeln kochen und den Brokkoli in den letzten fünf Minuten mitgaren.",
                        "Etwas Kochwasser mit Frischkäse und Gouda cremig verrühren.",
                        "Nudeln und Brokkoli unterheben und abschmecken.");
                    case "Flammkuchen-Wraps" -> List.of(
                        "Wraps mit Schmand bestreichen.",
                        "Schinken und Frühlingszwiebeln darauf verteilen und würzen.",
                        "In der Pfanne oder im Ofen knusprig backen und in Stücke schneiden.");
                    case "Maultaschen-Gemüse-Pfanne" -> List.of(
                        "Maultaschen in Streifen schneiden und goldbraun anbraten.",
                        "Zucchini und Paprika zugeben und bissfest garen.",
                        "Tomaten kurz unterschwenken, würzen und servieren.");
                    case "Schnelle Kartoffelsuppe" -> List.of(
                        "Kartoffeln und Möhren klein würfeln und in Brühe weich kochen.",
                        "Die Suppe teilweise pürieren und die Würstchen in Scheiben zugeben.",
                        "Noch fünf Minuten erwärmen, abschmecken und servieren.");
                    default -> throw new IllegalArgumentException("Keine Zubereitung für " + recipeName);
                };
                }

            private RecipeSeed recipe(String name, String description, int prepMinutes, IngredientSeed... ingredients) {
            return new RecipeSeed(name, description, prepMinutes, List.of(ingredients));
            }

            private IngredientSeed ingredient(
                String name, double quantity, double kcalPer100, double proteinPer100) {
            return ingredient(name, quantity, kcalPer100, proteinPer100, "g");
            }

            private IngredientSeed ingredient(
                String name, double quantity, double kcalPer100, double proteinPer100, String unit) {
            return new IngredientSeed(name, quantity, kcalPer100, proteinPer100, unit);
            }

            private String imageUrl(String recipeName) {
            String photoId = switch (recipeName) {
                case "Spaghetti Bolognese" -> "1551183053-bf91a1d81141";
                case "Hähnchen-Gemüse-Pfanne" -> "1604908176997-125f25cc6f3d";
                case "Kartoffel-Möhren-Puffer" -> "1518013431117-eb1465fa5752";
                case "Cremige Schinken-Nudeln" -> "1563379926898-05f4575a45d8";
                case "Fischstäbchen mit Kartoffelstampf" -> "1534948216015-843149f72be3";
                case "Tortellini in Tomaten-Sahne" -> "1473093295043-cdd812d0e601";
                case "Hackbällchen in Paprikasauce" -> "1529042410759-befb1204b468";
                case "Käsespätzle mit Röstzwiebeln" -> "1571997478779-2adcbbe9ab2f";
                case "Mildes Chili con Carne" -> "1533777857889-4be7c70b33f7";
                case "Gnocchi-Spinat-Pfanne" -> "1585032226651-759b368d7246";
                case "Pfannkuchen mit Apfelmus" -> "1528207776546-365bb710ee93";
                case "Pizza-Toast" -> "1565299624946-b28f40a0ae38";
                case "Gebratener Reis mit Ei" -> "1603133872878-684f208fb84b";
                case "Wraps mit Hähnchen" -> "1626700051175-6818013e1d4f";
                case "Tomaten-Mozzarella-Couscous" -> "1547592180-85f173990554";
                case "Würstchen-Kartoffel-Pfanne" -> "1601050690117-94f5f6fa8bd7";
                case "Brokkoli-Käse-Nudeln" -> "1621996346565-e3dbc646d9a9";
                case "Flammkuchen-Wraps" -> "1603105037880-880cd4edfb0d";
                case "Maultaschen-Gemüse-Pfanne" -> "1543353071-873f17a7a088";
                case "Schnelle Kartoffelsuppe" -> "1547592166-23ac45744acd";
                default -> throw new IllegalArgumentException("Kein Bild für " + recipeName);
            };
            return "https://images.unsplash.com/photo-" + photoId
                + "?auto=format&fit=crop&w=900&q=80";
            }

            private record RecipeSeed(
                String name, String description, int prepMinutes, List<IngredientSeed> ingredients) {
            }

            private record IngredientSeed(
                String name, double quantity, double kcalPer100, double proteinPer100, String unit) {
            }
}
