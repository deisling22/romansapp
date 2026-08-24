package de.roman.speiseplan.recommendation;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import de.roman.speiseplan.auth.TokenService;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.Assertions;
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
class RecommendationControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TokenService tokenService;

    @Test
    void anonymousRequestReturnsTrendingFallback() throws Exception {
        mockMvc.perform(get("/api/recommendations"))
                .andExpect(status().isOk());
    }

    @Test
    void favoritingADishBoostsItIntoPersonalRecommendations() throws Exception {
        String token = tokenService.issueToken(Map.of("email", UUID.randomUUID() + "@example.com"));

        String planResponse = mockMvc.perform(post("/api/plans")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Empfehlungs-Test-Plan\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long planId = objectMapper.readTree(planResponse).get("id").asLong();

        MockMultipartFile image = new MockMultipartFile("image", "dish.jpg", "image/jpeg", new byte[] {1, 2, 3});
        String dishResponse = mockMvc.perform(multipart("/api/plans/{planId}/dishes", planId)
                        .file(image)
                        .param("name", "Empfehlungs-Test-Gericht"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long dishId = objectMapper.readTree(dishResponse).get("id").asLong();

        mockMvc.perform(put("/api/dishes/{dishId}/favorite", dishId)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"favorite\":true}"))
                .andExpect(status().isOk());

        String recommendationsResponse = mockMvc.perform(get("/api/recommendations")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JsonNode dishes = objectMapper.readTree(recommendationsResponse).get("dishes");
        boolean containsFavoritedDish = false;
        for (JsonNode dish : dishes) {
            if (dish.get("id").asLong() == dishId) {
                containsFavoritedDish = true;
                break;
            }
        }
        Assertions.assertTrue(
                containsFavoritedDish, "Das gerade favorisierte Gericht sollte in den persönlichen Empfehlungen auftauchen.");
    }
}
