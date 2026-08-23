package de.roman.speiseplan.dish;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import tools.jackson.databind.ObjectMapper;
import de.roman.speiseplan.auth.TokenService;
import de.roman.speiseplan.plan.CreatePlanRequest;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class DishControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

        @Autowired
        private TokenService tokenService;

    @Test
    void addIngredientsAndStepsComputeNutritionAndAreVisibleInDetail() throws Exception {
        long planId = createPlan("Nutrition-Test-Plan");
        long dishId = createDish(planId, "Nutrition-Test-Gericht");

        long ingredientId = createIngredient("Testzutat", 200, 20, "g");

        mockMvc.perform(post("/api/dishes/{dishId}/ingredients", dishId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AddDishIngredientRequest(ingredientId, 100))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.ingredientName").value("Testzutat"));

        mockMvc.perform(post("/api/dishes/{dishId}/steps", dishId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AddPrepStepRequest("Alles vermischen.", 60))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.text").value("Alles vermischen."));

        MockMultipartFile image = new MockMultipartFile("image", "gallery.jpg", "image/jpeg", new byte[] {1, 2, 3});
        mockMvc.perform(multipart("/api/dishes/{dishId}/images", dishId).file(image))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.imageUrl").value(org.hamcrest.Matchers.startsWith("/uploads/")));

        mockMvc.perform(get("/api/dishes/{dishId}", dishId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.caloriesPerServing").value(200.0))
                .andExpect(jsonPath("$.proteinPerServing").value(20.0))
                .andExpect(jsonPath("$.ingredients.length()").value(1))
                .andExpect(jsonPath("$.steps.length()").value(1))
                .andExpect(jsonPath("$.galleryImageUrls.length()").value(1));
    }

    @Test
    void searchFiltersByNameAndTag() throws Exception {
        mockMvc.perform(get("/api/dishes").param("search", "pasta"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name", org.hamcrest.Matchers.containsStringIgnoringCase("pasta")));

        mockMvc.perform(get("/api/dishes").param("tag", "vegetarisch"))
                .andExpect(status().isOk());
    }

    @Test
    void favoritesCanBeSavedFilteredAndRemoved() throws Exception {
        long planId = createPlan("Favoriten-Test-Plan");
        long dishId = createDish(planId, "Favoriten-Test-Gericht");
        String token = tokenService.issueToken(Map.of("email", "favorites@example.com", "name", "Favoriten Test"));

        mockMvc.perform(put("/api/dishes/{dishId}/favorite", dishId)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"favorite\":true}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.favorite").value(true));

        mockMvc.perform(get("/api/dishes/{dishId}", dishId).header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.favorite").value(true));

        mockMvc.perform(get("/api/dishes")
                        .header("Authorization", "Bearer " + token)
                        .param("favorites", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(dishId));

        mockMvc.perform(put("/api/dishes/{dishId}/favorite", dishId)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"favorite\":false}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.favorite").value(false));

        mockMvc.perform(get("/api/dishes")
                        .header("Authorization", "Bearer " + token)
                        .param("favorites", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
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
