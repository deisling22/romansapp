package de.roman.speiseplan.config;

import static org.assertj.core.api.Assertions.assertThat;

import de.roman.speiseplan.plan.MealPlan;
import de.roman.speiseplan.plan.MealPlanRepository;
import de.roman.speiseplan.plan.PlanEntry;
import de.roman.speiseplan.plan.PlanEntryRepository;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class DevDataSeederTest {
    @Autowired
    private MealPlanRepository mealPlanRepository;

    @Autowired
    private PlanEntryRepository planEntryRepository;

    @Test
    void seedsTenDistinctQuickFamilyRecipesPerExamplePlan() {
        List<PlanEntry> weekEntries = entriesFor("Diese Woche");
        List<PlanEntry> quickEntries = entriesFor("Schnelle Küche");

        assertThat(weekEntries).hasSize(11);
        assertThat(quickEntries).hasSize(11);

        Set<String> weekRecipes = addedRecipeNames(weekEntries);
        Set<String> quickRecipes = addedRecipeNames(quickEntries);
        assertThat(weekRecipes).hasSize(10);
        assertThat(quickRecipes).hasSize(10);
        assertThat(weekRecipes).doesNotContainAnyElementsOf(quickRecipes);

        assertThat(List.of(weekEntries, quickEntries).stream()
            .flatMap(entries -> entries.stream().skip(1))
            .map(entry -> entry.getDish().getImageUrl()))
            .hasSize(20)
            .doesNotHaveDuplicates()
            .allMatch(url -> url.startsWith("https://images.unsplash.com/photo-"));

        assertThat(weekEntries.stream().skip(1).map(entry -> entry.getDish()))
                .allSatisfy(dish -> {
                    assertThat(dish.getPrepMinutes()).isLessThan(25);
                    assertThat(dish.getServings()).isEqualTo(4);
                    assertThat(dish.getTags()).contains("familie");
                });
        assertThat(quickEntries.stream().skip(1).map(entry -> entry.getDish()))
                .allSatisfy(dish -> {
                    assertThat(dish.getPrepMinutes()).isLessThan(25);
                    assertThat(dish.getServings()).isEqualTo(4);
                    assertThat(dish.getTags()).contains("familie");
                });
    }

    private List<PlanEntry> entriesFor(String planName) {
        MealPlan plan = mealPlanRepository.findAll().stream()
                .filter(candidate -> planName.equals(candidate.getName()))
                .findFirst()
                .orElseThrow();
        return planEntryRepository.findByPlanIdOrderBySortOrderAsc(plan.getId());
    }

    private Set<String> addedRecipeNames(List<PlanEntry> entries) {
        return entries.stream()
                .skip(1)
                .map(entry -> entry.getDish().getName())
                .collect(Collectors.toSet());
    }
}
