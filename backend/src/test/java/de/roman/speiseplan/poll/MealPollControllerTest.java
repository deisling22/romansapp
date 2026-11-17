package de.roman.speiseplan.poll;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import de.roman.speiseplan.auth.TokenService;
import de.roman.speiseplan.dish.Dish;
import de.roman.speiseplan.dish.DishRepository;
import de.roman.speiseplan.household.HouseholdContext;
import de.roman.speiseplan.household.HouseholdService;
import de.roman.speiseplan.plan.MealPlan;
import de.roman.speiseplan.plan.MealPlanRepository;
import de.roman.speiseplan.plan.MealSlot;
import de.roman.speiseplan.plan.PlanEntry;
import de.roman.speiseplan.plan.PlanEntryRepository;
import java.sql.Timestamp;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.support.TransactionTemplate;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
class MealPollControllerTest {
    @Autowired private MockMvc mvc;
    @Autowired private ObjectMapper mapper;
    @Autowired private TokenService tokens;
    @Autowired private HouseholdService households;
    @Autowired private MealPlanRepository plans;
    @Autowired private PlanEntryRepository entries;
    @Autowired private DishRepository dishes;
    @Autowired private TransactionTemplate transactions;
    @Autowired private JdbcTemplate jdbc;
    @Autowired private MealPollService service;

    @Test
    void snapshotsNextTenAndSupportsAnonymousCompleteRankingsWithNameReplacementAndExactAverages() throws Exception {
        Fixture owner = fixture(12);
        JsonNode created = create(owner);
        String id = created.path("poll").path("id").asString();
        List<Long> options = optionIds(created.path("poll"));
        assertThat(options).containsExactlyElementsOf(owner.entries().subList(0, 10));
        Instant createdAt = Instant.parse(created.path("poll").path("createdAt").asString());
        assertThat(Instant.parse(created.path("poll").path("expiresAt").asString()))
                .isEqualTo(createdAt.plus(Duration.ofDays(5)));
        assertThat(created.path("voteCount").asInt()).isZero();
        assertThat(created.path("results").get(0).path("averageRank").isNull()).isTrue();
        mvc.perform(get("/api/public/meal-polls/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.options.length()").value(10))
                .andExpect(jsonPath("$.votes").doesNotExist())
                .andExpect(jsonPath("$.ownerEmail").doesNotExist());

        vote(id, "Anna", options);
        List<Long> reverse = new ArrayList<>(options);
        Collections.reverse(reverse);
        vote(id, "Ben", reverse);
        JsonNode tied = manage(owner, id);
        assertThat(tied.path("voteCount").asInt()).isEqualTo(2);
        for (JsonNode result : tied.path("results")) {
            assertThat(result.path("averageRank").asDouble()).isEqualTo(5.5);
        }
        assertThat(tied.path("results").get(0).path("option").path("entryId").asLong()).isEqualTo(options.getFirst());
        vote(id, "  ANNA  ", reverse);
        JsonNode replaced = manage(owner, id);
        assertThat(replaced.path("voteCount").asInt()).isEqualTo(2);
        assertThat(replaced.path("results").get(0).path("averageRank").asDouble()).isEqualTo(1);
        assertThat(replaced.path("results").get(0).path("option").path("entryId").asLong()).isEqualTo(reverse.getFirst());
        assertThat(manage(owner, id).path("votes").get(0).path("name").asString()).isEqualTo("ANNA");
    }

    @Test
    void averagesEverySubmittedRankWithoutRoundingBeforeSorting() throws Exception {
        Fixture owner = fixture(4);
        String id = create(owner).path("poll").path("id").asString();
        List<Long> ids = owner.entries();
        vote(id, "Anna", ids);
        vote(id, "Ben", List.of(ids.get(1), ids.get(2), ids.get(0), ids.get(3)));
        vote(id, "Clara", List.of(ids.get(1), ids.get(0), ids.get(3), ids.get(2)));
        JsonNode results = manage(owner, id).path("results");
        assertThat(results.get(0).path("option").path("entryId").asLong()).isEqualTo(ids.get(1));
        assertThat(results.get(0).path("averageRank").asDouble()).isEqualTo(4.0 / 3);
        assertThat(results.get(1).path("option").path("entryId").asLong()).isEqualTo(ids.get(0));
        assertThat(results.get(1).path("averageRank").asDouble()).isEqualTo(2);
        assertThat(results.get(2).path("averageRank").asDouble()).isEqualTo(3);
        assertThat(results.get(3).path("averageRank").asDouble()).isEqualTo(11.0 / 3);
    }

    @Test
    void rejectsIncompleteDuplicateForeignAndBlankBallotsAndAnonymousManagement() throws Exception {
        Fixture owner = fixture(3);
        String id = create(owner).path("poll").path("id").asString();
        List<List<Long>> invalid = List.of(
                List.of(owner.entries().getFirst()),
                List.of(owner.entries().get(0), owner.entries().get(0), owner.entries().get(2)),
                List.of(owner.entries().get(0), owner.entries().get(1), Long.MAX_VALUE));
        for (List<Long> ranking : invalid) {
            mvc.perform(post("/api/public/meal-polls/" + id + "/votes").contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(Map.of("name", "Test", "ranking", ranking))))
                    .andExpect(status().isBadRequest());
        }
        mvc.perform(post("/api/public/meal-polls/" + id + "/votes").contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(Map.of("name", " ", "ranking", owner.entries()))))
                .andExpect(status().isBadRequest());
        mvc.perform(post("/api/meal-polls")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/meal-polls/" + id)).andExpect(status().isUnauthorized());
        mvc.perform(post("/api/meal-polls/" + id + "/apply").contentType(MediaType.APPLICATION_JSON).content("{\"count\":1}"))
                .andExpect(status().isUnauthorized());
        assertThat(manage(owner, id).path("voteCount").asInt()).isZero();
    }

    @Test
    void onlyCreatorCanReadResultsCloseApplyOrDeleteEvenInSameHousehold() throws Exception {
        Fixture owner = fixture(3);
        Fixture other = fixture(2);
        String id = create(owner).path("poll").path("id").asString();
        mvc.perform(get("/api/meal-polls/" + id).header("Authorization", other.token())).andExpect(status().isNotFound());
        mvc.perform(post("/api/meal-polls/" + id + "/close").header("Authorization", other.token())).andExpect(status().isNotFound());
        mvc.perform(post("/api/meal-polls/" + id + "/apply").header("Authorization", other.token())
                        .contentType(MediaType.APPLICATION_JSON).content("{\"count\":1}")).andExpect(status().isNotFound());
        mvc.perform(delete("/api/meal-polls/" + id).header("Authorization", other.token())).andExpect(status().isNotFound());
        mvc.perform(get("/api/meal-polls").header("Authorization", other.token()))
                .andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(0));
        // Joining the household does not grant creator rights.
        String invite = mapper.readTree(mvc.perform(post("/api/household/invite").header("Authorization", owner.token()))
                .andReturn().getResponse().getContentAsString()).path("inviteCode").asString();
        mvc.perform(post("/api/household/join").header("Authorization", other.token()).contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(Map.of("code", invite)))).andExpect(status().isOk());
        mvc.perform(get("/api/meal-polls/" + id).header("Authorization", other.token())).andExpect(status().isNotFound());
        mvc.perform(post("/api/meal-polls/" + id + "/close").header("Authorization", owner.token()))
                .andExpect(status().isOk()).andExpect(jsonPath("$.poll.closed").value(true));
        mvc.perform(get("/api/public/meal-polls/" + id)).andExpect(status().isOk()).andExpect(jsonPath("$.closed").value(true));
        mvc.perform(post("/api/public/meal-polls/" + id + "/votes").contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(Map.of("name", "Late", "ranking", owner.entries()))))
                .andExpect(status().isConflict());
        mvc.perform(delete("/api/meal-polls/" + id).header("Authorization", owner.token())).andExpect(status().isNoContent());
        mvc.perform(get("/api/public/meal-polls/" + id)).andExpect(status().isNotFound());
    }

    @Test
    void topThreePrependInResultOrderKeepOtherDishesAndAreConsumedByCookingAndSkipping() throws Exception {
        Fixture owner = fixture(12);
        Fixture unrelated = fixture(2);
        HouseholdContext.set(unrelated.household());
        try {
            transactions.executeWithoutResult(status -> entries.findById(unrelated.entries().getFirst()).orElseThrow().setPriorityOrder(0));
        } finally {
            HouseholdContext.clear();
        }
        String id = create(owner).path("poll").path("id").asString();
        List<Long> preferred = new ArrayList<>(owner.entries().subList(0, 10));
        Collections.rotate(preferred, 3); // 8, 9, 10, 1, ...
        vote(id, "Familie", preferred);
        mvc.perform(post("/api/meal-polls/" + id + "/apply").header("Authorization", owner.token())
                        .contentType(MediaType.APPLICATION_JSON).content("{\"count\":3}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.poll.closed").value(true));
        List<Long> expected = new ArrayList<>(preferred.subList(0, 3));
        expected.addAll(owner.entries().stream().filter(entry -> !preferred.subList(0, 3).contains(entry)).toList());
        assertThat(planned(owner)).startsWith(expected.toArray(Long[]::new));
        assertThat(jdbc.queryForObject("select priority_order from plan_entry where id = ?",
                Integer.class, unrelated.entries().getFirst())).isZero();
        jdbc.update("update meal_poll set expires_at = ? where id = ?", Timestamp.from(Instant.now().minusSeconds(1)), id);
        service.deleteExpired();
        assertThat(planned(owner)).startsWith(expected.toArray(Long[]::new));
        mvc.perform(patch("/api/plan-entries/" + preferred.getFirst() + "/cook").header("Authorization", owner.token()))
                .andExpect(status().isOk());
        assertThat(planned(owner)).startsWith(preferred.get(1), preferred.get(2), owner.entries().getFirst());
        assertThat(jdbc.queryForObject("select priority_order from plan_entry where id = ?", Integer.class, preferred.getFirst())).isNull();
        mvc.perform(post("/api/plan-entries/" + preferred.get(1) + "/skip").header("Authorization", owner.token()))
                .andExpect(status().isNoContent());
        assertThat(planned(owner)).startsWith(preferred.get(2), owner.entries().getFirst(), owner.entries().get(1));
    }

    @Test
    void topSelectionWorksAcrossPlansAndMealSlotsWithoutMovingBreakfastToDinner() throws Exception {
        Fixture owner = fixture(5);
        HouseholdContext.set(owner.household());
        try {
            transactions.executeWithoutResult(status -> {
                PlanEntry breakfast = entries.findById(owner.entries().get(3)).orElseThrow();
                breakfast.setMealSlot(MealSlot.BREAKFAST);
                MealPlan second = plans.save(new MealPlan("Zweiter Plan"));
                second.setActive(true);
                entries.save(new PlanEntry(second, dishes.save(new Dish("Anderes Abendessen", "/uploads/test.jpg")), 0));
            });
        } finally {
            HouseholdContext.clear();
        }
        JsonNode poll = create(owner).path("poll");
        String id = poll.path("id").asString();
        List<Long> ranking = optionIds(poll);
        ranking.remove(owner.entries().get(4));
        ranking.addFirst(owner.entries().get(4));
        vote(id, "Familie", ranking);
        mvc.perform(post("/api/meal-polls/" + id + "/apply").header("Authorization", owner.token())
                        .contentType(MediaType.APPLICATION_JSON).content("{\"count\":2}")).andExpect(status().isOk());
        JsonNode schedule = mapper.readTree(mvc.perform(get("/api/schedule?days=14").header("Authorization", owner.token()))
                .andReturn().getResponse().getContentAsString());
        JsonNode today = schedule.path("days").get(0).path("meals");
        assertThat(today.get(0).path("mealSlot").asString()).isEqualTo("BREAKFAST");
        assertThat(today.get(0).path("planEntryId").asLong()).isEqualTo(owner.entries().get(3));
        assertThat(today.get(1).path("planEntryId").asLong()).isEqualTo(owner.entries().get(4));
        assertThat(today.get(1).path("mealSlot").asString()).isEqualTo("DINNER");
        long otherDinner = poll.path("options").valueStream()
                .filter(option -> option.path("name").asString().equals("Anderes Abendessen"))
                .findFirst().orElseThrow().path("entryId").asLong();
        assertThat(planned(owner)).startsWith(owner.entries().get(4), owner.entries().get(0),
                otherDinner, owner.entries().get(1), otherDinner, owner.entries().get(2));
    }

    @Test
    void expiresAllPollsIncludingClosedAndDeletesVotesAndOptions() throws Exception {
        Fixture owner = fixture(3);
        for (boolean closed : List.of(false, true)) {
            String id = create(owner).path("poll").path("id").asString();
            vote(id, "Anna", owner.entries());
            if (closed) {
                mvc.perform(post("/api/meal-polls/" + id + "/close").header("Authorization", owner.token())).andExpect(status().isOk());
            }
            jdbc.update("update meal_poll set expires_at = ? where id = ?", Timestamp.from(Instant.now().minusSeconds(1)), id);
            mvc.perform(get("/api/public/meal-polls/" + id)).andExpect(status().isNotFound());
            mvc.perform(get("/api/meal-polls/" + id).header("Authorization", owner.token())).andExpect(status().isNotFound());
            mvc.perform(post("/api/public/meal-polls/" + id + "/votes").contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(Map.of("name", "Late", "ranking", owner.entries())))).andExpect(status().isNotFound());
            service.deleteExpired();
            assertThat(jdbc.queryForObject("select count(*) from meal_poll where id = ?", Integer.class, id)).isZero();
            assertThat(jdbc.queryForObject("select count(*) from meal_poll_vote where poll_id = ?", Integer.class, id)).isZero();
            assertThat(jdbc.queryForObject("select count(*) from meal_poll_option where poll_id = ?", Integer.class, id)).isZero();
        }
    }

    @Test
    void refusesInvalidApplyAndDoesNotPartiallyChangePlanIfOptionWasChanged() throws Exception {
        Fixture owner = fixture(4);
        String id = create(owner).path("poll").path("id").asString();
        mvc.perform(post("/api/meal-polls/" + id + "/apply").header("Authorization", owner.token())
                        .contentType(MediaType.APPLICATION_JSON).content("{\"count\":2}")).andExpect(status().isBadRequest());
        vote(id, "Anna", owner.entries());
        for (int count : List.of(0, 5, 11)) {
            mvc.perform(post("/api/meal-polls/" + id + "/apply").header("Authorization", owner.token())
                    .contentType(MediaType.APPLICATION_JSON).content("{\"count\":" + count + "}")).andExpect(status().isBadRequest());
        }
        HouseholdContext.set(owner.household());
        try {
            transactions.executeWithoutResult(status -> entries.findById(owner.entries().get(1)).orElseThrow().setMealSlot(MealSlot.LUNCH));
        } finally {
            HouseholdContext.clear();
        }
        mvc.perform(post("/api/meal-polls/" + id + "/apply").header("Authorization", owner.token())
                        .contentType(MediaType.APPLICATION_JSON).content("{\"count\":2}")).andExpect(status().isConflict());
        assertThat(jdbc.queryForObject("select count(*) from plan_entry where household_id = ? and priority_order is not null",
                Integer.class, owner.household())).isZero();
        assertThat(manage(owner, id).path("poll").path("closed").asBoolean()).isFalse();
    }

    @Test
    void rejectsTooSmallRotationAndOnlyIncludesEachDishOnce() throws Exception {
        Fixture small = fixture(1);
        mvc.perform(post("/api/meal-polls").header("Authorization", small.token())).andExpect(status().isConflict());
        Fixture owner = fixture(3);
        HouseholdContext.set(owner.household());
        try {
            transactions.executeWithoutResult(status -> {
                PlanEntry first = entries.findById(owner.entries().getFirst()).orElseThrow();
                entries.save(new PlanEntry(first.getPlan(), first.getDish(), 4));
            });
        } finally {
            HouseholdContext.clear();
        }
        assertThat(create(owner).path("poll").path("options").size()).isEqualTo(3);
    }

    private Fixture fixture(int count) {
        String email = "poll-" + UUID.randomUUID() + "@example.com";
        long household = households.resolveHouseholdId(email);
        HouseholdContext.set(household);
        try {
            List<Long> ids = transactions.execute(status -> {
                MealPlan plan = plans.save(new MealPlan("Familienplan"));
                plan.setActive(true);
                List<Long> result = new ArrayList<>();
                for (int i = 0; i < count; i++) {
                    Dish dish = dishes.save(new Dish("Gericht " + (i + 1), "/uploads/test.jpg"));
                    result.add(entries.save(new PlanEntry(plan, dish, i)).getId());
                }
                return result;
            });
            return new Fixture("Bearer " + tokens.issueToken(Map.of("email", email)), household, ids);
        } finally {
            HouseholdContext.clear();
        }
    }

    private JsonNode create(Fixture owner) throws Exception {
        return mapper.readTree(mvc.perform(post("/api/meal-polls").header("Authorization", owner.token()))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString());
    }

    private JsonNode manage(Fixture owner, String id) throws Exception {
        return mapper.readTree(mvc.perform(get("/api/meal-polls/" + id).header("Authorization", owner.token()))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString());
    }

    private void vote(String id, String name, List<Long> ranking) throws Exception {
        mvc.perform(post("/api/public/meal-polls/" + id + "/votes").contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(Map.of("name", name, "ranking", ranking))))
                .andExpect(status().isNoContent());
    }

    private List<Long> optionIds(JsonNode poll) {
        List<Long> ids = new ArrayList<>();
        poll.path("options").forEach(option -> ids.add(option.path("entryId").asLong()));
        return ids;
    }

    private List<Long> planned(Fixture owner) throws Exception {
        JsonNode schedule = mapper.readTree(mvc.perform(get("/api/schedule?days=14").header("Authorization", owner.token()))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString());
        List<Long> ids = new ArrayList<>();
        for (JsonNode day : schedule.path("days")) {
            for (JsonNode meal : day.path("meals")) {
                if (meal.path("status").asString().equals("PLANNED") && meal.path("mealSlot").asString().equals("DINNER")) {
                    ids.add(meal.path("planEntryId").asLong());
                }
            }
        }
        return ids;
    }

    private record Fixture(String token, long household, List<Long> entries) {
    }
}
