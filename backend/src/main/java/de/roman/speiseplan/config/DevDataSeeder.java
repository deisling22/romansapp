package de.roman.speiseplan.config;

import de.roman.speiseplan.dish.Dish;
import de.roman.speiseplan.dish.DishRepository;
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
            PlanEntryRepository planEntryRepository) {
        return arguments -> {
            if (mealPlanRepository.count() > 0) {
                return;
            }

            MealPlan weekPlan = mealPlanRepository.save(new MealPlan("Diese Woche"));
            MealPlan quickPlan = mealPlanRepository.save(new MealPlan("Schnelle Küche"));
            Dish pasta = dishRepository.save(new Dish(
                    "Pasta mit Tomaten",
                    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80"));
            planEntryRepository.save(new PlanEntry(weekPlan, pasta, 0));
            planEntryRepository.save(new PlanEntry(quickPlan, pasta, 0));
        };
    }
}