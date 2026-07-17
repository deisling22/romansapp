package de.roman.speiseplan.config;

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

@Configuration
@Profile("dev")
public class DevDataSeeder {
    @Bean
    CommandLineRunner seedDemoData(
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
        };
    }
}
