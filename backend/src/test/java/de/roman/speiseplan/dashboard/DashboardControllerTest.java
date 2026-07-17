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
                        .content(objectMapper.writeValueAsString(new ProfileUpdateRequest(1.0, 100.0, 180.0))))
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
