package de.roman.speiseplan.pantry;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import de.roman.speiseplan.auth.TokenService;
import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/** Runs in an own household (token) so counts are not influenced by other tests. */
@SpringBootTest
@AutoConfigureMockMvc
class PantryExpiryTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TokenService tokenService;

    @Test
    void shelfLifeGuessCoversCompoundWordsAndLeavesUnknownItemsEmpty() {
        LocalDate day = LocalDate.of(2026, 1, 10);
        assertThat(ShelfLife.guess("Vollmilch", day)).isEqualTo(day.plusDays(5));
        assertThat(ShelfLife.guess("Rinderhackfleisch", day)).isEqualTo(day.plusDays(2));
        assertThat(ShelfLife.guess("Eier", day)).isEqualTo(day.plusDays(14));
        assertThat(ShelfLife.guess("Reis", day)).isNull();
        assertThat(ShelfLife.guess("Weizenmehl", day)).isNull();
    }

    @Test
    void expiringItemsAreSortedCountedAndSuggestDishes() throws Exception {
        String token = tokenService.issueToken(Map.of("email", "ablauf-" + UUID.randomUUID() + "@example.com"));
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        String yogurt = "Ablauf-Joghurt-" + suffix;
        String rice = "Ablauf-Reis-" + suffix;
        LocalDate today = LocalDate.now();

        JsonNode added = read(mockMvc.perform(auth(post("/api/pantry/batches"), token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"items\":["
                                + "{\"ingredientName\":\"" + rice + "\",\"quantity\":500,\"unit\":\"g\"},"
                                + "{\"ingredientName\":\"Vollmilch\",\"quantity\":1,\"unit\":\"l\"},"
                                + "{\"ingredientName\":\"" + yogurt + "\",\"quantity\":200,\"unit\":\"g\","
                                + "\"expiresOn\":\"" + today.plusDays(1) + "\"}]}"))
                .andExpect(status().isCreated()));
        long riceId = -1;
        for (JsonNode item : added) {
            if (item.get("ingredientName").asString().equals(rice)) {
                riceId = item.get("id").asLong();
                assertThat(item.get("expiresOn").isNull()).isTrue();
            }
            if (item.get("ingredientName").asString().equals("Vollmilch")) {
                assertThat(item.get("expiresOn").asString()).isEqualTo(today.plusDays(5).toString());
            }
        }

        mockMvc.perform(auth(get("/api/pantry"), token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].ingredientName").value(yogurt))
                .andExpect(jsonPath("$[2].ingredientName").value(rice));
        mockMvc.perform(auth(get("/api/dashboard"), token))
                .andExpect(jsonPath("$.expiringSoonCount").value(1));

        mockMvc.perform(auth(put("/api/pantry/{id}/expiry", riceId), token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"expiresOn\":\"" + today.minusDays(1) + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.expiresOn").value(today.minusDays(1).toString()));
        mockMvc.perform(auth(get("/api/dashboard"), token))
                .andExpect(jsonPath("$.expiringSoonCount").value(2));

        long planId = read(mockMvc.perform(auth(post("/api/plans"), token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Ablaufplan\"}"))
                .andExpect(status().isCreated())).get("id").asLong();
        long dishId = read(mockMvc.perform(multipart("/api/plans/{planId}/dishes", planId)
                        .file(new MockMultipartFile("image", "dish.jpg", "image/jpeg", new byte[] {1, 2, 3}))
                        .param("name", "Joghurt-Bowl " + suffix)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isCreated())).get("id").asLong();
        long ingredientId = read(mockMvc.perform(auth(post("/api/ingredients"), token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"" + yogurt + "\",\"kcalPer100\":100,\"proteinPer100\":10,\"unit\":\"g\"}"))
                .andExpect(status().isCreated())).get("id").asLong();
        mockMvc.perform(auth(post("/api/dishes/{dishId}/ingredients", dishId), token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"ingredientId\":" + ingredientId + ",\"quantityGrams\":100}"))
                .andExpect(status().isCreated());

        mockMvc.perform(auth(get("/api/pantry/use-soon"), token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items.length()").value(2))
                .andExpect(jsonPath("$.dishes[0].id").value(dishId))
                .andExpect(jsonPath("$.dishes[0].matchedIngredients[0]").value(yogurt));

        // Weekly nutrition: cooking today adds a tracked day
        long planEntryId = read(mockMvc.perform(auth(get("/api/plans/{planId}/dishes", planId), token)))
                .get(0).get("planEntryId").asLong();
        mockMvc.perform(auth(patch("/api/plan-entries/{id}/cook", planEntryId), token))
                .andExpect(status().isOk());
        JsonNode week = read(mockMvc.perform(auth(get("/api/dashboard/week"), token)).andExpect(status().isOk()));
        assertThat(week.get("days")).hasSize(7);
        JsonNode lastDay = week.get("days").get(6);
        assertThat(lastDay.get("date").asString()).isEqualTo(today.toString());
        assertThat(lastDay.get("meals").asInt()).isEqualTo(1);
        assertThat(week.get("trackedDays").asInt()).isEqualTo(1);
        assertThat(week.get("averageCalories").asDouble()).isEqualTo(lastDay.get("calories").asDouble());
    }

    private JsonNode read(org.springframework.test.web.servlet.ResultActions result) throws Exception {
        return objectMapper.readTree(result.andReturn().getResponse().getContentAsString());
    }

    private static MockHttpServletRequestBuilder auth(MockHttpServletRequestBuilder builder, String token) {
        return builder.header("Authorization", "Bearer " + token);
    }
}
