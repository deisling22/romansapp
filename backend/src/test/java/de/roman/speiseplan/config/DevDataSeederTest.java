package de.roman.speiseplan.config;

import static org.assertj.core.api.Assertions.assertThat;

import de.roman.speiseplan.dish.DishIngredientRepository;
import de.roman.speiseplan.dish.PrepStepRepository;
import de.roman.speiseplan.creator.Creator;
import de.roman.speiseplan.creator.CreatorRepository;
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
import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
class DevDataSeederTest {
    @Autowired
    private MealPlanRepository mealPlanRepository;

    @Autowired
    private PlanEntryRepository planEntryRepository;

    @Autowired
    private DishIngredientRepository dishIngredientRepository;

    @Autowired
    private PrepStepRepository prepStepRepository;

    @Autowired
    private CreatorRepository creatorRepository;

    @Autowired
    @Qualifier("seedDemoData")
    private CommandLineRunner seedDemoData;

    @Test
    @Transactional
    void gigaRomanPublishesCompleteCopiesWithoutChangingTheAnonymousPlanAndSeedingIsIdempotent() throws Exception {
        Creator creator = creatorRepository.findByHandle("gigaroman").orElseThrow();
        assertThat(creator.getName()).isEqualTo("Giga Roman");
        assertThat(creator.getAvatarUrl()).isEqualTo("assets/creators/giga-roman.svg");
        List<MealPlan> publishedPlans = mealPlanRepository.findByCreatorIdOrderByCreatedAtAsc(creator.getId());
        assertThat(publishedPlans).hasSize(1);
        MealPlan published = publishedPlans.getFirst();
        assertThat(published.getName()).isEqualTo("Romans Plan");
        assertThat(published.getHouseholdId()).isNull();
        List<PlanEntry> source = entriesFor("Romans Plan").stream()
                .filter(entry -> entry.getPlan().getCreator() == null).toList();
        List<PlanEntry> copies = planEntryRepository.findByPlanIdOrderBySortOrderAsc(published.getId());
        assertThat(source).hasSize(48);
        assertThat(copies).hasSameSizeAs(source);
        for (int i = 0; i < source.size(); i++) {
            PlanEntry original = source.get(i);
            PlanEntry copy = copies.get(i);
            assertThat(original.getDish().getHouseholdId()).isNotNull();
            assertThat(copy.getDish().getHouseholdId()).isNull();
            assertThat(copy.getDish().getId()).isNotEqualTo(original.getDish().getId());
            assertThat(copy.getDish().getName()).isEqualTo(original.getDish().getName());
            assertThat(copy.getDish().getDescription()).isEqualTo(original.getDish().getDescription());
            assertThat(copy.getMealSlot()).isEqualTo(original.getMealSlot());
            assertThat(copy.isCooked()).isFalse();
            assertThat(dishIngredientRepository.findByDishId(copy.getDish().getId()))
                    .usingRecursiveFieldByFieldElementComparatorIgnoringFields("id", "dish")
                    .containsExactlyElementsOf(dishIngredientRepository.findByDishId(original.getDish().getId()));
            assertThat(prepStepRepository.findByDishIdOrderByStepOrderAsc(copy.getDish().getId()))
                    .usingRecursiveFieldByFieldElementComparatorIgnoringFields("id", "dish")
                    .containsExactlyElementsOf(prepStepRepository.findByDishIdOrderByStepOrderAsc(original.getDish().getId()));
        }
        long creatorCount = creatorRepository.count();
        long planCount = mealPlanRepository.count();
        seedDemoData.run();
        assertThat(creatorRepository.count()).isEqualTo(creatorCount);
        assertThat(mealPlanRepository.count()).isEqualTo(planCount);
        assertThat(planEntryRepository.findByPlanIdOrderBySortOrderAsc(published.getId())).hasSize(48);
    }

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

    @Test
    void seedsRomansPlanWithCompleteRecipes() {
        List<PlanEntry> entries = entriesFor("Romans Plan");

        assertThat(entries).hasSize(48);
        assertThat(entries.stream().map(entry -> entry.getDish().getName()))
            .doesNotHaveDuplicates()
            .contains("Bratwurstsemmeln", "Milchreis", "Griechischer Bauernsalat");
        assertThat(entries).allSatisfy(entry -> {
            Long dishId = entry.getDish().getId();
            assertThat(dishIngredientRepository.findByDishId(dishId)).isNotEmpty();
            assertThat(prepStepRepository.findByDishIdOrderByStepOrderAsc(dishId)).hasSizeGreaterThanOrEqualTo(3);
        });
    }

    private List<PlanEntry> entriesFor(String planName) {
        MealPlan plan = mealPlanRepository.findAll().stream()
                .filter(candidate -> planName.equals(candidate.getName()) && candidate.getCreator() == null)
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
