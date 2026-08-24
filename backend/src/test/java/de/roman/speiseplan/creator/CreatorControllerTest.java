package de.roman.speiseplan.creator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import de.roman.speiseplan.auth.TokenService;
import de.roman.speiseplan.plan.MealPlan;
import de.roman.speiseplan.plan.MealPlanRepository;
import java.util.Map;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
class CreatorControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

        @Autowired
        private TokenService tokenService;

        @Autowired
        private CreatorRepository creatorRepository;

        @Autowired
        private MealPlanRepository mealPlanRepository;

    @Test
    void creatorFeedProfilesAndPlanCopyAreAvailable() throws Exception {
        String creatorsResponse = mockMvc.perform(get("/api/creators"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(8))
                .andExpect(jsonPath("$[0].planCount").value(1))
                .andReturn()
                .getResponse()
                .getContentAsString();
        long creatorId = objectMapper.readTree(creatorsResponse).get(0).get("id").asLong();

        String creatorResponse = mockMvc.perform(get("/api/creators/{creatorId}", creatorId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.plans.length()").value(1))
                .andReturn()
                .getResponse()
                .getContentAsString();
        JsonNode creator = objectMapper.readTree(creatorResponse);
        long planId = creator.get("plans").get(0).get("id").asLong();
        String planName = creator.get("plans").get(0).get("name").stringValue();

        String dishesResponse = mockMvc.perform(
                        get("/api/creators/{creatorId}/plans/{planId}/dishes", creatorId, planId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(4))
                .andReturn()
                .getResponse()
                .getContentAsString();
        long creatorPlanEntryId = objectMapper.readTree(dishesResponse).get(0).get("planEntryId").asLong();

        mockMvc.perform(patch("/api/plan-entries/{planEntryId}/cook", creatorPlanEntryId))
                .andExpect(status().isNotFound());
        mockMvc.perform(get("/api/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nextDish.planId").value(1));

        mockMvc.perform(post("/api/creators/{creatorId}/plans/{planId}/copy", creatorId, planId))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value(planName + " (Kopie)"))
                .andExpect(jsonPath("$.dishCount").value(4));

        String userPlansResponse = mockMvc.perform(get("/api/plans"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        JsonNode userPlans = objectMapper.readTree(userPlansResponse);
        assertThat(userPlans).anySatisfy(plan ->
                assertThat(plan.get("name").stringValue()).isEqualTo(planName + " (Kopie)"));
        assertThat(userPlans).noneSatisfy(plan ->
                assertThat(plan.get("name").stringValue()).isEqualTo(planName));
    }

    @Test
        @Transactional
    void subscriptionRequiresLoginAndReportsNewCreatorPlan() throws Exception {
        Creator creator = creatorRepository.findByHandle("leasofenkueche").orElseThrow();
        String token = tokenService.issueToken(Map.of("email", "creator-fan@example.com"));

        mockMvc.perform(post("/api/creator-subscriptions/{creatorId}", creator.getId()))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/creator-subscriptions/{creatorId}", creator.getId())
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());
        mockMvc.perform(get("/api/creator-subscriptions/{creatorId}", creator.getId())
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.subscribed").value(true));

        mealPlanRepository.saveAndFlush(new MealPlan("Ganz neuer Creator-Plan", creator));

        mockMvc.perform(get("/api/creator-subscriptions/notifications")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].creatorName").value("Lea Winter"))
                .andExpect(jsonPath("$[0].newPlanCount").value(1));

        mockMvc.perform(get("/api/creator-subscriptions/notifications")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }
}
