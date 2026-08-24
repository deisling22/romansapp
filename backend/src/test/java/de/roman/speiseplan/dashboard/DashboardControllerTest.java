package de.roman.speiseplan.dashboard;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import tools.jackson.databind.ObjectMapper;
import de.roman.speiseplan.dish.AddDishIngredientRequest;
import de.roman.speiseplan.dish.CreateIngredientRequest;
import de.roman.speiseplan.dish.NutritionUpdateRequest;
import de.roman.speiseplan.plan.CreatePlanRequest;
import de.roman.speiseplan.profile.ProfileUpdateRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void markingADishCookedAddsItsNutritionToTodaysDashboardTotals() throws Exception {
        mockMvc.perform(put("/api/profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ProfileUpdateRequest(1.0, 100.0, 180.0, false))))
                .andExpect(status().isOk());

        long planId = createPlan("Dashboard-Test-Plan");
        long dishId = createDish(planId, "Dashboard-Test-Gericht");
        long ingredientId = createIngredient("Dashboard-Zutat", 300, 30, "g");
        mockMvc.perform(post("/api/dishes/{dishId}/ingredients", dishId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AddDishIngredientRequest(ingredientId, 100))))
                .andExpect(status().isCreated());

        String dishesResponse = mockMvc.perform(get("/api/plans/{planId}/dishes", planId))
                .andReturn()
                .getResponse()
                .getContentAsString();
        long planEntryId = objectMapper.readTree(dishesResponse).get(0).get("planEntryId").asLong();

        String before = mockMvc.perform(get("/api/dashboard"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        double caloriesBefore = objectMapper.readTree(before).get("caloriesToday").asDouble();

        mockMvc.perform(patch("/api/plan-entries/{id}/cook", planEntryId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.proteinGoal").value(200.0));

        String after = mockMvc.perform(get("/api/dashboard"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        double caloriesAfter = objectMapper.readTree(after).get("caloriesToday").asDouble();

        org.assertj.core.api.Assertions.assertThat(caloriesAfter - caloriesBefore).isEqualTo(300.0);
    }

    @Test
    void markingADishCookedAddsOptionalNutritionWhenTrackingIsEnabled() throws Exception {
        mockMvc.perform(put("/api/profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ProfileUpdateRequest(1.0, 100.0, 180.0, true))))
                .andExpect(status().isOk());

        long planId = createPlan("Naehrwert-Test-Plan");
        long dishId = createDish(planId, "Naehrwert-Test-Gericht");
        mockMvc.perform(put("/api/dishes/{dishId}/nutrition", dishId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new NutritionUpdateRequest(40.0, 10.0, 500.0, 60.0, 5.0, 20.0, 1.2, 150.0))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.carbsGrams").value(40.0));

        String dishesResponse = mockMvc.perform(get("/api/plans/{planId}/dishes", planId))
                .andReturn()
                .getResponse()
                .getContentAsString();
        long planEntryId = objectMapper.readTree(dishesResponse).get(0).get("planEntryId").asLong();

        String before = mockMvc.perform(get("/api/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nutritionTrackingEnabled").value(true))
                .andReturn()
                .getResponse()
                .getContentAsString();
        double carbsBefore = objectMapper.readTree(before).get("carbsToday").asDouble();
        double fatBefore = objectMapper.readTree(before).get("fatToday").asDouble();
        double vitaminCBefore = objectMapper.readTree(before).get("vitaminCToday").asDouble();
        double vitaminKBefore = objectMapper.readTree(before).get("vitaminKToday").asDouble();
        double vitaminB12Before = objectMapper.readTree(before).get("vitaminB12Today").asDouble();
        double folateBefore = objectMapper.readTree(before).get("folateToday").asDouble();

        mockMvc.perform(patch("/api/plan-entries/{id}/cook", planEntryId))
                .andExpect(status().isOk());

        String after = mockMvc.perform(get("/api/dashboard"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        double carbsAfter = objectMapper.readTree(after).get("carbsToday").asDouble();
        double fatAfter = objectMapper.readTree(after).get("fatToday").asDouble();
        double vitaminCAfter = objectMapper.readTree(after).get("vitaminCToday").asDouble();
        double vitaminKAfter = objectMapper.readTree(after).get("vitaminKToday").asDouble();
        double vitaminB12After = objectMapper.readTree(after).get("vitaminB12Today").asDouble();
        double folateAfter = objectMapper.readTree(after).get("folateToday").asDouble();

        org.assertj.core.api.Assertions.assertThat(carbsAfter - carbsBefore).isEqualTo(40.0);
        org.assertj.core.api.Assertions.assertThat(fatAfter - fatBefore).isEqualTo(10.0);
        org.assertj.core.api.Assertions.assertThat(vitaminCAfter - vitaminCBefore).isEqualTo(60.0);
        org.assertj.core.api.Assertions.assertThat(vitaminKAfter - vitaminKBefore).isEqualTo(20.0);
        org.assertj.core.api.Assertions.assertThat(vitaminB12After - vitaminB12Before).isEqualTo(1.2);
        org.assertj.core.api.Assertions.assertThat(folateAfter - folateBefore).isEqualTo(150.0);
    }

    @Test
    void markingADishCookedConsumesMatchingPantryStock() throws Exception {
        String ingredientName = "Vorratsverbrauch-Zutat";
        String cartResponse = mockMvc.perform(post("/api/shopping-list")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"ingredientName\":\"" + ingredientName
                                + "\",\"quantity\":250,\"unit\":\"g\"}"))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        long cartItemId = objectMapper.readTree(cartResponse).get("id").asLong();
        mockMvc.perform(patch("/api/shopping-list/{itemId}", cartItemId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"checked\":true}"))
                .andExpect(status().isOk());
        mockMvc.perform(post("/api/shopping-list/checkout"))
                .andExpect(status().isOk());

        long planId = createPlan("Vorratsverbrauch-Plan");
        long dishId = createDish(planId, "Vorratsverbrauch-Gericht");
        long ingredientId = createIngredient(ingredientName, 100, 10, "g");
        mockMvc.perform(post("/api/dishes/{dishId}/ingredients", dishId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AddDishIngredientRequest(ingredientId, 100))))
                .andExpect(status().isCreated());
        String dishesResponse = mockMvc.perform(get("/api/plans/{planId}/dishes", planId))
                .andReturn()
                .getResponse()
                .getContentAsString();
        long planEntryId = objectMapper.readTree(dishesResponse).get(0).get("planEntryId").asLong();

        mockMvc.perform(patch("/api/plan-entries/{id}/cook", planEntryId))
                .andExpect(status().isOk());
        mockMvc.perform(patch("/api/plan-entries/{id}/cook", planEntryId))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/pantry"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.ingredientName == '" + ingredientName + "')].quantity").value(150.0));
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

    private long createIngredient(String name, double kcal, double protein, String unit) throws Exception {
        String response = mockMvc.perform(post("/api/ingredients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CreateIngredientRequest(name, kcal, protein, unit))))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        return objectMapper.readTree(response).get("id").asLong();
    }
}
