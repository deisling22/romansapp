package de.roman.speiseplan.cost;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/** Runs in an own household (token) so the shared default household of other tests stays untouched. */
@SpringBootTest
@AutoConfigureMockMvc
class ReceiptControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TokenService tokenService;

    @Test
    void receiptsAndManualCostsFeedTheDashboardWhenEnabled() throws Exception {
        String token = tokenService.issueToken(Map.of("email", "kosten-" + UUID.randomUUID() + "@example.com"));

        mockMvc.perform(auth(get("/api/dashboard"), token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.costTrackingEnabled").value(false))
                .andExpect(jsonPath("$.cost").doesNotExist());

        mockMvc.perform(auth(put("/api/profile"), token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"defaultPortionSize\":1,\"nutritionTrackingEnabled\":false,"
                                + "\"costTrackingEnabled\":true,\"weeklyBudgetEur\":100}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.costTrackingEnabled").value(true))
                .andExpect(jsonPath("$.weeklyBudgetEur").value(100.0));

        LocalDate today = LocalDate.now();
        JsonNode receipt = objectMapper.readTree(mockMvc.perform(auth(post("/api/receipts"), token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"purchasedOn\":\"" + today + "\",\"totalEur\":42.456,\"store\":\" REWE \"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.totalEur").value(42.46))
                .andExpect(jsonPath("$.store").value("REWE"))
                .andReturn().getResponse().getContentAsString());
        mockMvc.perform(auth(post("/api/receipts"), token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"purchasedOn\":\"" + today + "\",\"totalEur\":-1}"))
                .andExpect(status().isBadRequest());

        long planId = objectMapper.readTree(mockMvc.perform(auth(post("/api/plans"), token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Kostenplan\"}"))
                .andReturn().getResponse().getContentAsString()).get("id").asLong();
        mockMvc.perform(auth(put("/api/plans/" + planId + "/settings"), token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"active\":true}"))
                .andExpect(status().isOk());
        mockMvc.perform(auth(put("/api/plans/" + planId + "/cost"), token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"costEur\":55.5}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.costEur").value(55.5));

        mockMvc.perform(auth(get("/api/dashboard"), token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.costTrackingEnabled").value(true))
                .andExpect(jsonPath("$.cost.spentThisWeek").value(42.46))
                .andExpect(jsonPath("$.cost.plannedCost").value(55.5))
                .andExpect(jsonPath("$.cost.budgetPercent").value(42));

        // Anonymous default household does not see these receipts
        assertThat(mockMvc.perform(get("/api/receipts")).andReturn().getResponse().getContentAsString())
                .doesNotContain("REWE");

        mockMvc.perform(auth(delete("/api/receipts/" + receipt.get("id").asLong()), token))
                .andExpect(status().isNoContent());
        mockMvc.perform(auth(get("/api/receipts"), token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    private static MockHttpServletRequestBuilder auth(MockHttpServletRequestBuilder builder, String token) {
        return builder.header("Authorization", "Bearer " + token);
    }
}
