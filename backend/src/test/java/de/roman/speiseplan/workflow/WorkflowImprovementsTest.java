package de.roman.speiseplan.workflow;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import de.roman.speiseplan.auth.TokenService;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/** Every test runs in its own household (token), so stock and plans do not leak between tests. */
@SpringBootTest
@AutoConfigureMockMvc
class WorkflowImprovementsTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TokenService tokenService;

    private String token;
    private String suffix;

    @BeforeEach
    void ownHousehold() {
        token = tokenService.issueToken(Map.of("email", "workflow-" + UUID.randomUUID() + "@example.com"));
        suffix = UUID.randomUUID().toString().substring(0, 8);
    }

    @Test
    void spellingAndUnitsMatchAcrossRecipeShoppingListAndPantry() throws Exception {
        long planId = createPlan("Tomatenplan", true);
        long dishId = createDish(planId, "Tomatensalat " + suffix);
        addIngredient(dishId, "Tomaten", "g", 300);
        long entryId = json(perform(get("/api/plans/{id}/dishes", planId))).get(0).get("planEntryId").asLong();

        addToPantry("Tomate", 2, "Stk.", null);
        JsonNode meal = firstPlannedMeal();
        assertThat(meal.get("ingredientStatus").asString()).isEqualTo("MISSING");
        assertThat(meal.get("missingIngredients").get(0).get("uncoveredQuantity").asDouble()).isEqualTo(100.0);

        perform(post("/api/plan-entries/{id}/missing-to-shopping-list", entryId)).andExpect(status().isOk());
        perform(post("/api/shopping-list")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"ingredientName\":\"tomate\",\"quantity\":1,\"unit\":\"Stk.\"}"))
                .andExpect(status().isCreated());
        JsonNode list = json(perform(get("/api/shopping-list")));
        assertThat(list).hasSize(1);
        assertThat(list.get(0).get("ingredientName").asString()).isEqualTo("Tomaten");
        assertThat(list.get(0).get("quantity").asDouble()).isEqualTo(200.0);
        assertThat(list.get(0).get("category").asString()).isEqualTo("Obst & Gemüse");
        assertThat(firstPlannedMeal().get("ingredientStatus").asString()).isEqualTo("ON_LIST");

        perform(post("/api/shopping-list/checkout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"itemIds\":[" + list.get(0).get("id").asLong() + "]}"))
                .andExpect(status().isOk());
        assertThat(json(perform(get("/api/shopping-list")))).isEmpty();
        assertThat(firstPlannedMeal().get("ingredientStatus").asString()).isEqualTo("AVAILABLE");

        // Due today in the plan: cooking from the dish page ticks the plan entry off
        perform(post("/api/dishes/{id}/cook", dishId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.planEntryId").value(entryId));
        JsonNode pantry = json(perform(get("/api/pantry")));
        assertThat(pantry).hasSize(1);
        assertThat(pantry.get(0).get("ingredientName").asString()).isEqualTo("Tomaten");
        assertThat(pantry.get(0).get("quantity").asDouble()).isEqualTo(100.0);
    }

    @Test
    void purchasesArriveAsWholePacksAndThePantryCanBeCorrected() throws Exception {
        JsonNode butter = json(perform(post("/api/shopping-list")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"ingredientName\":\"Butter\",\"quantity\":120,\"unit\":\"g\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.category").value("Kühlregal"))
                .andExpect(jsonPath("$.purchaseQuantity").value(250.0))
                .andExpect(jsonPath("$.packSize").value(250.0)));
        perform(post("/api/shopping-list")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"ingredientName\":\"Bleibt-" + suffix + "\",\"quantity\":1,\"unit\":\"Stk.\"}"))
                .andExpect(status().isCreated());

        perform(post("/api/shopping-list/checkout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"itemIds\":[" + butter.get("id").asLong() + "]}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].quantity").value(250.0));
        assertThat(json(perform(get("/api/shopping-list")))).hasSize(1);

        long pantryId = json(perform(get("/api/pantry"))).get(0).get("id").asLong();
        perform(put("/api/pantry/{id}/quantity", pantryId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"quantity\":100}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(100.0));
        perform(put("/api/pantry/{id}/quantity", pantryId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"quantity\":0}"))
                .andExpect(status().isBadRequest());

        perform(delete("/api/pantry/{id}", pantryId).param("reason", "WASTED")).andExpect(status().isNoContent());
        perform(get("/api/pantry/use-soon")).andExpect(jsonPath("$.wastedThisMonth").value(1));
        assertThat(json(perform(get("/api/pantry")))).isEmpty();

        perform(delete("/api/shopping-list")).andExpect(status().isNoContent());
        assertThat(json(perform(get("/api/shopping-list")))).isEmpty();
    }

    @Test
    void spontaneousCookingUsesThePantryAndShiftsTodaysPlan() throws Exception {
        long planId = createPlan("Aktiver Plan", true);
        createDish(planId, "Geplant " + suffix);
        long sourcePlan = createPlan("Sammlung", false);
        long dishId = createDish(sourcePlan, "Spontan " + suffix);
        String rice = "Spontanreis-" + suffix;
        addIngredient(dishId, rice, "g", 200);
        addToPantry(rice, 500, "g", null);

        perform(get("/api/dishes/{id}/availability", dishId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.servings").value(1.0))
                .andExpect(jsonPath("$.ingredients[0].missing").value(0.0));
        perform(get("/api/dishes/{id}/availability", dishId).param("servings", "4"))
                .andExpect(jsonPath("$.ingredients[0].required").value(800.0))
                .andExpect(jsonPath("$.ingredients[0].uncovered").value(300.0));
        perform(post("/api/dishes/{id}/missing-to-shopping-list", dishId).param("servings", "4"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].quantity").value(300.0));
        perform(get("/api/dishes/{id}/availability", dishId).param("servings", "4"))
                .andExpect(jsonPath("$.ingredients[0].missing").value(300.0))
                .andExpect(jsonPath("$.ingredients[0].uncovered").value(0.0));

        perform(post("/api/dishes/{id}/cook", dishId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.planEntryId").doesNotExist());
        assertThat(json(perform(get("/api/pantry"))).get(0).get("quantity").asDouble()).isEqualTo(300.0);

        JsonNode days = json(perform(get("/api/schedule").param("days", "2"))).get("days");
        JsonNode today = days.get(0).get("meals").get(0);
        assertThat(today.get("status").asString()).isEqualTo("COOKED");
        assertThat(today.get("dishName").asString()).isEqualTo("Spontan " + suffix);
        assertThat(days.get(1).get("meals").get(0).get("dishName").asString()).isEqualTo("Geplant " + suffix);
        perform(get("/api/dashboard")).andExpect(status().isOk());

        perform(post("/api/plans/{id}/entries", planId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"dishId\":" + dishId + ",\"mealSlot\":\"LUNCH\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.mealSlot").value("LUNCH"));
        assertThat(json(perform(get("/api/plans/{id}/dishes", planId)))).hasSize(2);
    }

    @Test
    void useSoonRanksByUrgencyCoverageAndTasteAndIgnoresStockThePlanUsesUp() throws Exception {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        long planId = createPlan("Aktiver Plan", true);
        long plannedDish = createDish(planId, "Geplant " + suffix);
        String plannedStock = "Planvorrat-" + suffix;
        addIngredient(plannedDish, plannedStock, "g", 200);
        addToPantry(plannedStock, 200, "g", tomorrow);

        String expiring = "Ablaufzutat-" + suffix;
        String atHome = "Dazutat-" + suffix;
        String tag = "lieblingstag" + suffix;
        addToPantry(expiring, 300, "g", tomorrow);
        addToPantry(atHome, 500, "g", null);
        long collection = createPlan("Sammlung", false);
        long complete = createDish(collection, "Komplett " + suffix);
        addIngredient(complete, expiring, "g", 100);
        addIngredient(complete, atHome, "g", 100);
        long partial = createDish(collection, "Teilweise " + suffix);
        addIngredient(partial, expiring, "g", 100);
        addIngredient(partial, "Fehlzutat-" + suffix, "g", 100);
        perform(put("/api/dishes/{id}/details", partial)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"servings\":1,\"tags\":[\"" + tag + "\"]}"))
                .andExpect(status().isOk());

        JsonNode useSoon = json(perform(get("/api/pantry/use-soon")).andExpect(status().isOk()));
        assertThat(plannedFlags(useSoon)).containsEntry(plannedStock, true).containsEntry(expiring, false);
        assertThat(dishIds(useSoon)).containsExactly(complete, partial);
        assertThat(useSoon.get("dishes").get(0).get("coveragePercent").asInt()).isEqualTo(100);
        assertThat(useSoon.get("dishes").get(1).get("missingCount").asInt()).isEqualTo(1);
        assertThat(useSoon.get("dishes").get(0).get("matchedIngredients").get(0).asString()).isEqualTo(expiring);
        assertThat(useSoon.get("todayEntry").get("dishId").asLong()).isEqualTo(plannedDish);
        assertThat(useSoon.get("todayEntry").get("dayOffset").asInt()).isZero();

        // The start screen gets plan, figures and suggestions with one request
        perform(get("/api/home"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.schedule.days.length()").value(7))
                .andExpect(jsonPath("$.schedule.days[0].meals[0].dishId").value(plannedDish))
                .andExpect(jsonPath("$.dashboard.expiringSoonCount").value(2))
                .andExpect(jsonPath("$.dashboard.pantryItemCount").value(3))
                .andExpect(jsonPath("$.useSoon.dishes[0].id").value(complete))
                .andExpect(jsonPath("$.useSoon.dishes.length()").value(2))
                .andExpect(jsonPath("$.week").doesNotExist());

        perform(put("/api/taste")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"likedTags\":[\"" + tag + "\"]}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.likedTags[0]").value(tag));
        useSoon = json(perform(get("/api/pantry/use-soon")));
        assertThat(dishIds(useSoon)).containsExactly(partial, complete);
        assertThat(useSoon.get("dishes").get(0).get("liked").asBoolean()).isTrue();

        perform(post("/api/recommendations/dishes/{id}/less", partial)).andExpect(status().isNoContent());
        assertThat(dishIds(json(perform(get("/api/pantry/use-soon"))))).containsExactly(complete);
        perform(get("/api/recommendations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dishes[?(@.id == " + partial + ")]").isEmpty());
    }

    private static Map<String, Boolean> plannedFlags(JsonNode useSoon) {
        Map<String, Boolean> flags = new java.util.HashMap<>();
        for (JsonNode item : useSoon.get("items")) {
            flags.put(item.get("ingredientName").asString(), item.get("planned").asBoolean());
        }
        return flags;
    }

    private static List<Long> dishIds(JsonNode useSoon) {
        List<Long> ids = new ArrayList<>();
        for (JsonNode dish : useSoon.get("dishes")) {
            ids.add(dish.get("id").asLong());
        }
        return ids;
    }

    private JsonNode firstPlannedMeal() throws Exception {
        for (JsonNode meal : json(perform(get("/api/schedule").param("days", "1"))).get("days").get(0).get("meals")) {
            if ("PLANNED".equals(meal.get("status").asString())) {
                return meal;
            }
        }
        throw new AssertionError("No planned meal today");
    }

    private long createPlan(String name, boolean active) throws Exception {
        long planId = json(perform(post("/api/plans")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"" + name + "\"}"))
                .andExpect(status().isCreated())).get("id").asLong();
        if (active) {
            perform(put("/api/plans/{id}/settings", planId)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"active\":true}"))
                    .andExpect(status().isOk());
        }
        return planId;
    }

    private long createDish(long planId, String name) throws Exception {
        return json(mockMvc.perform(multipart("/api/plans/{planId}/dishes", planId)
                        .file(new MockMultipartFile("image", "dish.jpg", "image/jpeg", new byte[] {1, 2, 3}))
                        .param("name", name)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isCreated())).get("id").asLong();
    }

    private void addIngredient(long dishId, String name, String unit, double quantity) throws Exception {
        long ingredientId = json(perform(post("/api/ingredients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"" + name + "\",\"kcalPer100\":100,\"proteinPer100\":10,\"unit\":\"" + unit + "\"}"))
                .andExpect(status().isCreated())).get("id").asLong();
        perform(post("/api/dishes/{dishId}/ingredients", dishId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"ingredientId\":" + ingredientId + ",\"quantityGrams\":" + quantity + "}"))
                .andExpect(status().isCreated());
    }

    private void addToPantry(String name, double quantity, String unit, LocalDate expiresOn) throws Exception {
        String expiry = expiresOn == null ? "" : ",\"expiresOn\":\"" + expiresOn + "\"";
        perform(post("/api/pantry/batches")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"items\":[{\"ingredientName\":\"" + name + "\",\"quantity\":" + quantity
                                + ",\"unit\":\"" + unit + "\"" + expiry + "}]}"))
                .andExpect(status().isCreated());
    }

    private ResultActions perform(MockHttpServletRequestBuilder builder) throws Exception {
        return mockMvc.perform(builder.header("Authorization", "Bearer " + token));
    }

    private JsonNode json(ResultActions result) throws Exception {
        return objectMapper.readTree(result.andReturn().getResponse().getContentAsString());
    }
}
