package de.roman.speiseplan.sync;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import de.roman.speiseplan.auth.TokenService;
import java.time.Instant;
import java.util.List;
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
class SyncControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TokenService tokenService;

    @Test
    void syncRequiresAuthentication() throws Exception {
        mockMvc.perform(post("/api/sync")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"plans\":[]}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void newerTimestampWinsDuringSync() throws Exception {
        String planClientId = UUID.randomUUID().toString();
        String dishClientId = UUID.randomUUID().toString();
        String token = tokenService.issueToken(Map.of("email", "sync-test@example.com"));
        Instant initialTime = Instant.parse("2026-08-24T10:00:00Z");

        performSync(token, new SyncPlanRequest(
                planClientId,
                "Lokaler Plan",
                initialTime,
                List.of(new SyncDishRequest(
                        dishClientId,
                        "Lokales Gericht",
                        initialTime,
                        "data:image/jpeg;base64,AQID"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Lokaler Plan"))
                .andExpect(jsonPath("$[0].dishes[0].name").value("Lokales Gericht"));

        performSync(token, new SyncPlanRequest(
                planClientId,
                "Veralteter Plan",
                initialTime.minusSeconds(60),
                List.of(new SyncDishRequest(
                        dishClientId,
                        "Veraltetes Gericht",
                        initialTime.minusSeconds(60),
                        null))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Lokaler Plan"))
                .andExpect(jsonPath("$[0].dishes[0].name").value("Lokales Gericht"));

        performSync(token, new SyncPlanRequest(
                planClientId,
                "Neuer Plan",
                initialTime.plusSeconds(60),
                List.of(new SyncDishRequest(
                        dishClientId,
                        "Neues Gericht",
                        initialTime.plusSeconds(60),
                        null))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Neuer Plan"))
                .andExpect(jsonPath("$[0].dishes[0].name").value("Neues Gericht"));
    }

    private org.springframework.test.web.servlet.ResultActions performSync(
            String token, SyncPlanRequest plan) throws Exception {
        return mockMvc.perform(post("/api/sync")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new SyncRequest(List.of(plan)))));
    }
}