package de.roman.speiseplan.schedule;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import de.roman.speiseplan.dish.AddDishIngredientRequest;
import de.roman.speiseplan.dish.CreateIngredientRequest;
import de.roman.speiseplan.dish.DishDetailsUpdateRequest;
import de.roman.speiseplan.plan.CreatePlanRequest;
import de.roman.speiseplan.plan.PlanSettingsRequest;
import de.roman.speiseplan.profile.ProfileUpdateRequest;
import de.roman.speiseplan.shopping.CreateShoppingListItemRequest;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
class ScheduleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void isolateActivePlans() throws Exception {
        mockMvc.perform(put("/api/profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new ProfileUpdateRequest(1.0, null, null, false, null, null, null, null, 2, 2))))
                .andExpect(status().isOk());
        String plans = mockMvc.perform(get("/api/plans")).andReturn().getResponse().getContentAsString();
        for (JsonNode plan : objectMapper.readTree(plans)) {
            updatePlanSettings(plan.get("id").asLong(), new PlanSettingsRequest(false, false));
        }
    }

    @Test
    void scheduleRotatesThroughTheActivePlanAndReactsToCookSkipSwapAndReplace() throws Exception {
        long planId = createPlan("Rotations-Plan");
        createDish(planId, "Rotation-A");
        long dishB = createDish(planId, "Rotation-B");
        createDish(planId, "Rotation-C");
        updatePlanSettings(planId, new PlanSettingsRequest(true, false));
        List<Long> entryIds = entryIds(planId);

        assertThat(plannedDishNames("DINNER")).startsWith("Rotation-A", "Rotation-B", "Rotation-C", "Rotation-A");

        mockMvc.perform(post("/api/plan-entries/{id}/skip", entryIds.get(1))).andExpect(status().isNoContent());
        assertThat(plannedDishNames("DINNER")).startsWith("Rotation-A", "Rotation-C", "Rotation-B");

        mockMvc.perform(post("/api/plan-entries/{id}/swap", entryIds.get(0))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"otherEntryId\":" + entryIds.get(2) + "}"))
                .andExpect(status().isNoContent());
        assertThat(plannedDishNames("DINNER")).startsWith("Rotation-C", "Rotation-A", "Rotation-B");

        mockMvc.perform(patch("/api/plan-entries/{id}/cook", entryIds.get(0))).andExpect(status().isOk());
        assertThat(plannedDishNames("DINNER")).startsWith("Rotation-A", "Rotation-B", "Rotation-C");

        long replacement = createDish(createPlan("Ersatz-Quelle"), "Rotation-Ersatz");
        mockMvc.perform(put("/api/plan-entries/{id}/dish", entryIds.get(2))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"dishId\":" + replacement + "}"))
                .andExpect(status().isNoContent());
        assertThat(plannedDishNames("DINNER")).startsWith("Rotation-Ersatz", "Rotation-B", "Rotation-C");

        mockMvc.perform(get("/api/plan-entries/{id}/replacement-suggestions", entryIds.get(2)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.dishId == " + dishB + ")]").isEmpty());
    }

    @Test
    void multipleActivePlansTakeTurnsAndLeftoversBecomeTomorrowsLunch() throws Exception {
        long firstPlan = createPlan("Aktiv-Plan-Eins");
        createDish(firstPlan, "Eins-Gericht");
        long secondPlan = createPlan("Aktiv-Plan-Zwei");
        createDish(secondPlan, "Zwei-Gericht");
        updatePlanSettings(firstPlan, new PlanSettingsRequest(true, false));
        updatePlanSettings(secondPlan, new PlanSettingsRequest(true, true));

        List<String> dinners = plannedDishNames("DINNER");
        assertThat(dinners.subList(0, 4)).containsExactlyInAnyOrder(
                "Eins-Gericht", "Zwei-Gericht", "Eins-Gericht", "Zwei-Gericht");
        assertThat(dinners.get(0)).isNotEqualTo(dinners.get(1));

        List<JsonNode> leftovers = meals(7).stream()
                .filter(meal -> "LEFTOVERS".equals(meal.get("status").stringValue()))
                .toList();
        assertThat(leftovers).isNotEmpty();
        assertThat(leftovers).allSatisfy(meal -> {
            assertThat(meal.get("mealSlot").stringValue()).isEqualTo("LUNCH");
            assertThat(meal.get("dishName").stringValue()).isEqualTo("Zwei-Gericht");
        });
    }

    @Test
    void missingIngredientsAndUpcomingShoppingListAreIdempotentAndIncludeStaples() throws Exception {
        String ingredientName = "Fruehstuecks-Zutat-" + System.nanoTime();
        String stapleName = "Grundbedarf-" + System.nanoTime();
        long planId = createPlan("Fruehstuecks-Plan");
        long dishId = createDish(planId, "Fruehstueck");
        long ingredientId = createIngredient(ingredientName, "g");
        mockMvc.perform(post("/api/dishes/{dishId}/ingredients", dishId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AddDishIngredientRequest(ingredientId, 100))))
                .andExpect(status().isCreated());
        String pieceName = "Stueck-Zutat-" + System.nanoTime();
        mockMvc.perform(post("/api/dishes/{dishId}/ingredients", dishId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new AddDishIngredientRequest(createIngredient(pieceName, "Stk."), 0.25))))
                .andExpect(status().isCreated());
        mockMvc.perform(put("/api/dishes/{dishId}/details", dishId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new DishDetailsUpdateRequest(null, null, 1, List.of()))))
                .andExpect(status().isOk());
        long entryId = entryIds(planId).getFirst();
        mockMvc.perform(put("/api/plan-entries/{id}/meal-slot", entryId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"mealSlot\":\"BREAKFAST\"}"))
                .andExpect(status().isNoContent());
        updatePlanSettings(planId, new PlanSettingsRequest(true, false));

        JsonNode firstBreakfast = firstPlanned("BREAKFAST");
        assertThat(firstBreakfast.get("ingredientStatus").stringValue()).isEqualTo("MISSING");
        // Household of two eats two portions of a one-portion recipe.
        assertThat(firstBreakfast.get("missingIngredients").get(0).get("uncoveredQuantity").asDouble()).isEqualTo(200.0);

        mockMvc.perform(post("/api/plan-entries/{id}/missing-to-shopping-list", entryId)).andExpect(status().isOk());
        mockMvc.perform(post("/api/plan-entries/{id}/missing-to-shopping-list", entryId)).andExpect(status().isOk());
        assertThat(shoppingQuantity(ingredientName)).isEqualTo(200.0);
        // 2 x 0.25 pieces are needed, but only whole pieces can be bought.
        assertThat(shoppingQuantity(pieceName)).isEqualTo(1.0);
        assertThat(firstPlanned("BREAKFAST").get("ingredientStatus").stringValue()).isEqualTo("ON_LIST");

        String staple = mockMvc.perform(post("/api/staples")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CreateShoppingListItemRequest(stapleName, 2, "Stk."))))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        mockMvc.perform(post("/api/schedule/shopping-list").param("days", "2")).andExpect(status().isOk());
        mockMvc.perform(post("/api/schedule/shopping-list").param("days", "2")).andExpect(status().isOk());
        assertThat(shoppingQuantity(ingredientName)).isEqualTo(400.0);
        assertThat(shoppingQuantity(stapleName)).isEqualTo(2.0);

        mockMvc.perform(delete("/api/staples/{id}", objectMapper.readTree(staple).get("id").asLong()))
                .andExpect(status().isNoContent());
    }

    private List<JsonNode> meals(int days) throws Exception {
        String response = mockMvc.perform(get("/api/schedule").param("days", String.valueOf(days)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        List<JsonNode> meals = new ArrayList<>();
        for (JsonNode day : objectMapper.readTree(response).get("days")) {
            day.get("meals").forEach(meals::add);
        }
        return meals;
    }

    private List<String> plannedDishNames(String slot) throws Exception {
        return meals(14).stream()
                .filter(meal -> "PLANNED".equals(meal.get("status").stringValue()))
                .filter(meal -> slot.equals(meal.get("mealSlot").stringValue()))
                .map(meal -> meal.get("dishName").stringValue())
                .toList();
    }

    private JsonNode firstPlanned(String slot) throws Exception {
        return meals(14).stream()
                .filter(meal -> "PLANNED".equals(meal.get("status").stringValue()))
                .filter(meal -> slot.equals(meal.get("mealSlot").stringValue()))
                .findFirst()
                .orElseThrow();
    }

    private double shoppingQuantity(String ingredientName) throws Exception {
        String response = mockMvc.perform(get("/api/shopping-list")).andReturn().getResponse().getContentAsString();
        double total = 0;
        for (JsonNode item : objectMapper.readTree(response)) {
            if (ingredientName.equals(item.get("ingredientName").stringValue())) {
                total += item.get("quantity").asDouble();
            }
        }
        return total;
    }

    private List<Long> entryIds(long planId) throws Exception {
        String response = mockMvc.perform(get("/api/plans/{planId}/dishes", planId))
                .andReturn()
                .getResponse()
                .getContentAsString();
        List<Long> ids = new ArrayList<>();
        objectMapper.readTree(response).forEach(dish -> ids.add(dish.get("planEntryId").asLong()));
        return ids;
    }

    private void updatePlanSettings(long planId, PlanSettingsRequest request) throws Exception {
        mockMvc.perform(put("/api/plans/{planId}/settings", planId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    private long createPlan(String name) throws Exception {
        String response = mockMvc.perform(post("/api/plans")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CreatePlanRequest(name))))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        return objectMapper.readTree(response).get("id").asLong();
    }

    private long createDish(long planId, String name) throws Exception {
        MockMultipartFile image = new MockMultipartFile("image", "dish.jpg", "image/jpeg", new byte[] {1, 2, 3});
        String response = mockMvc.perform(multipart("/api/plans/{planId}/dishes", planId)
                        .file(image)
                        .param("name", name))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        return objectMapper.readTree(response).get("id").asLong();
    }

    private long createIngredient(String name, String unit) throws Exception {
        String response = mockMvc.perform(post("/api/ingredients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CreateIngredientRequest(name, 100, 10, unit))))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        return objectMapper.readTree(response).get("id").asLong();
    }
}
