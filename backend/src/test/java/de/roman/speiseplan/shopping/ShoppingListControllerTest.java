package de.roman.speiseplan.shopping;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import tools.jackson.databind.ObjectMapper;
import de.roman.speiseplan.dish.AddDishIngredientRequest;
import de.roman.speiseplan.dish.CreateIngredientRequest;
import de.roman.speiseplan.plan.CreatePlanRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class ShoppingListControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void generateAndToggleShoppingListItems() throws Exception {
        long planId = createPlan("Einkaufslisten-Test-Plan");
        long dishId = createDish(planId, "Einkaufslisten-Test-Gericht");
        long ingredientId = createIngredient("Einkaufslisten-Zutat", 100, 10, "g");
        mockMvc.perform(post("/api/dishes/{dishId}/ingredients", dishId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AddDishIngredientRequest(ingredientId, 250))))
                .andExpect(status().isCreated());

        String generateResponse = mockMvc.perform(post("/api/plans/{planId}/shopping-list/generate", planId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].ingredientName").value("Einkaufslisten-Zutat"))
                .andExpect(jsonPath("$[0].quantity").value(250.0))
                .andExpect(jsonPath("$[0].checked").value(false))
                .andReturn()
                .getResponse()
                .getContentAsString();
        long itemId = objectMapper.readTree(generateResponse).get(0).get("id").asLong();

        mockMvc.perform(patch("/api/shopping-list/{itemId}", itemId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"checked\": true}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.checked").value(true));

        mockMvc.perform(get("/api/plans/{planId}/shopping-list", planId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].checked").value(true));

        mockMvc.perform(get("/api/shopping-list"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id == " + itemId + ")].ingredientName")
                        .value("Einkaufslisten-Zutat"));
    }

    @Test
    void checkedCartItemsMoveToPantryAndCanBeRemoved() throws Exception {
        long planId = createPlan("Vorrats-Test-Plan");
        long dishId = createDish(planId, "Vorrats-Test-Gericht");
        long ingredientId = createIngredient("Vorrats-Test-Zutat", 100, 10, "g");
        mockMvc.perform(post("/api/dishes/{dishId}/ingredients", dishId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AddDishIngredientRequest(ingredientId, 250))))
                .andExpect(status().isCreated());

        String generateResponse = mockMvc.perform(post("/api/plans/{planId}/shopping-list/generate", planId))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        long itemId = objectMapper.readTree(generateResponse).get(0).get("id").asLong();
        mockMvc.perform(patch("/api/shopping-list/{itemId}", itemId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"checked\": true}"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/shopping-list"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id == " + itemId + ")].checked").value(true));

        String pantryResponse = mockMvc.perform(post("/api/shopping-list/checkout"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].ingredientName").value("Vorrats-Test-Zutat"))
                .andExpect(jsonPath("$[0].quantity").value(250.0))
                .andExpect(jsonPath("$[0].purchasedAt").isNotEmpty())
                .andReturn()
                .getResponse()
                .getContentAsString();
        long pantryItemId = objectMapper.readTree(pantryResponse).get(0).get("id").asLong();

        mockMvc.perform(get("/api/shopping-list"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id == " + itemId + ")]").isEmpty());
        mockMvc.perform(delete("/api/pantry/{itemId}", pantryItemId))
                .andExpect(status().isNoContent());
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
