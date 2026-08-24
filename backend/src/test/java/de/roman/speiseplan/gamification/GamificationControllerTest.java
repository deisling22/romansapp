package de.roman.speiseplan.gamification;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import de.roman.speiseplan.auth.TokenService;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
class GamificationControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TokenService tokenService;

    @Test
    void progressRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/gamification"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void repeatedEventIsCountedOnceAndBuildsProgress() throws Exception {
        String token = tokenForUniqueUser();
        String eventId = UUID.randomUUID().toString();
        Map<String, Object> request = Map.of("events", new Object[] {Map.of(
                "eventId", eventId,
                "type", "COOK_DISH",
                "referenceId", "dish-42",
                "occurredAt", Instant.now().toString())});

        postEvents(token, request)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.xp").value(70))
                .andExpect(jsonPath("$.level").value(1))
                .andExpect(jsonPath("$.currentStreak").value(1))
                .andExpect(jsonPath("$.cookedDishes").value(1))
                .andExpect(jsonPath("$.achievements[0].tier").value("BRONZE"))
                .andExpect(jsonPath("$.weeklyGoals[1].completed").value(true));

        postEvents(token, request)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.xp").value(70))
                .andExpect(jsonPath("$.cookedDishes").value(1));
    }

    @Test
    void lockedFrameCannotBeSelected() throws Exception {
        String token = tokenForUniqueUser();

        mockMvc.perform(put("/api/gamification/settings")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"selectedFrame\":\"GOLD\",\"selectedTitle\":\"KUECHENSTARTER\","
                            + "\"weeklyCookTarget\":4,\"householdWeeklyTarget\":8}"))
                .andExpect(status().isBadRequest());
    }

    private org.springframework.test.web.servlet.ResultActions postEvents(String token, Object request) throws Exception {
        return mockMvc.perform(post("/api/gamification/events")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)));
    }

    private String tokenForUniqueUser() {
        return tokenService.issueToken(Map.of("email", UUID.randomUUID() + "@example.com"));
    }
}