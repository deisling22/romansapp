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
import de.roman.speiseplan.pantry.PantryItem;
import de.roman.speiseplan.pantry.PantryItemRepository;
import de.roman.speiseplan.plan.CreatePlanRequest;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.JsonNode;

@SpringBootTest
@AutoConfigureMockMvc
class ShoppingListControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

        @Autowired
        private PantryItemRepository pantryItemRepository;

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

        @Test
        void equalCartItemsAreCombinedByIngredientAndUnit() throws Exception {
                String ingredientName = "Warenkorb-Summen-Tomaten";

                addCartItem(ingredientName, 400, "g");
                addCartItem(ingredientName.toLowerCase(), 400, "g");

                String cartResponse = mockMvc.perform(get("/api/shopping-list"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$[?(@.ingredientName == '" + ingredientName + "')].quantity").value(800.0))
                                .andReturn()
                                .getResponse()
                                .getContentAsString();
                long matchCount = 0;
                for (JsonNode item : objectMapper.readTree(cartResponse)) {
                        if (ingredientName.equalsIgnoreCase(item.get("ingredientName").stringValue())) {
                                matchCount++;
                        }
                }
                org.assertj.core.api.Assertions.assertThat(matchCount).isEqualTo(1);
        }

        @Test
        void equalItemsShareOnePantryEntryPerCheckoutButNotAcrossCheckouts() throws Exception {
                String ingredientName = "Vorrats-Chargen-Tomaten";

                long firstItemId = addCartItem(ingredientName, 400, "g");
                long combinedItemId = addCartItem(ingredientName, 400, "g");
                org.assertj.core.api.Assertions.assertThat(combinedItemId).isEqualTo(firstItemId);
                checkItem(firstItemId);
                mockMvc.perform(post("/api/shopping-list/checkout"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$[0].quantity").value(800.0));

                long secondPurchaseId = addCartItem(ingredientName, 200, "g");
                checkItem(secondPurchaseId);
                mockMvc.perform(post("/api/shopping-list/checkout"))
                                .andExpect(status().isOk());

                String pantryResponse = mockMvc.perform(get("/api/pantry"))
                                .andExpect(status().isOk())
                                .andReturn()
                                .getResponse()
                                .getContentAsString();
                JsonNode matchingItems = objectMapper.readTree(pantryResponse);
                long matchCount = 0;
                double totalQuantity = 0;
                for (JsonNode item : matchingItems) {
                        if (ingredientName.equals(item.get("ingredientName").stringValue())) {
                                matchCount++;
                                totalQuantity += item.get("quantity").asDouble();
                        }
                }
                org.assertj.core.api.Assertions.assertThat(matchCount).isEqualTo(2);
                org.assertj.core.api.Assertions.assertThat(totalQuantity).isEqualTo(1000.0);
        }

        @Test
        void existingPantryDuplicatesAreCombinedOnlyWhenTheirPurchaseTimeMatches() throws Exception {
                String ingredientName = "Bestehende-Vorrats-Chargen-Tomaten";
                Instant firstPurchase = Instant.parse("2026-08-20T10:15:30Z");
                Instant secondPurchase = Instant.parse("2026-08-21T10:15:30Z");
                pantryItemRepository.saveAll(List.of(
                                new PantryItem(ingredientName, 400, "g", firstPurchase),
                                new PantryItem(ingredientName, 400, "g", firstPurchase),
                                new PantryItem(ingredientName, 200, "g", secondPurchase)));

                String pantryResponse = mockMvc.perform(get("/api/pantry"))
                                .andExpect(status().isOk())
                                .andReturn()
                                .getResponse()
                                .getContentAsString();
                long matchCount = 0;
                double firstBatchQuantity = 0;
                double secondBatchQuantity = 0;
                for (JsonNode item : objectMapper.readTree(pantryResponse)) {
                        if (!ingredientName.equals(item.get("ingredientName").stringValue())) {
                                continue;
                        }
                        matchCount++;
                        if (firstPurchase.toString().equals(item.get("purchasedAt").stringValue())) {
                                firstBatchQuantity = item.get("quantity").asDouble();
                        }
                        if (secondPurchase.toString().equals(item.get("purchasedAt").stringValue())) {
                                secondBatchQuantity = item.get("quantity").asDouble();
                        }
                }
                org.assertj.core.api.Assertions.assertThat(matchCount).isEqualTo(2);
                org.assertj.core.api.Assertions.assertThat(firstBatchQuantity).isEqualTo(800.0);
                org.assertj.core.api.Assertions.assertThat(secondBatchQuantity).isEqualTo(200.0);
        }

                @Test
                void scannedIngredientsAreStoredAsOneCombinedPantryBatch() throws Exception {
                                String response = mockMvc.perform(post("/api/pantry/batches")
                                                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                                                .content("""
                                                                                                                                {"items":[
                                                                                                                                        {"ingredientName":"Scan-Tomate","quantity":2,"unit":"Stk."},
                                                                                                                                        {"ingredientName":"scan-tomate","quantity":1,"unit":"Stk."},
                                                                                                                                        {"ingredientName":"Scan-Banane","quantity":3,"unit":"Stk."}
                                                                                                                                ]}
                                                                                                                                """))
                                                                .andExpect(status().isCreated())
                                                                .andExpect(jsonPath("$.length()").value(2))
                                                                .andExpect(jsonPath("$[?(@.ingredientName == 'Scan-Tomate')].quantity").value(3.0))
                                                                .andReturn()
                                                                .getResponse()
                                                                .getContentAsString();

                                JsonNode items = objectMapper.readTree(response);
                                org.assertj.core.api.Assertions.assertThat(items.get(0).get("purchasedAt").stringValue())
                                                                .isEqualTo(items.get(1).get("purchasedAt").stringValue());
                }

        private long addCartItem(String ingredientName, double quantity, String unit) throws Exception {
                String response = mockMvc.perform(post("/api/shopping-list")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(objectMapper.writeValueAsString(
                                                                new CreateShoppingListItemRequest(ingredientName, quantity, unit))))
                                .andExpect(status().isCreated())
                                .andReturn()
                                .getResponse()
                                .getContentAsString();
                return objectMapper.readTree(response).get("id").asLong();
        }

        private void checkItem(long itemId) throws Exception {
                mockMvc.perform(patch("/api/shopping-list/{itemId}", itemId)
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content("{\"checked\": true}"))
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
