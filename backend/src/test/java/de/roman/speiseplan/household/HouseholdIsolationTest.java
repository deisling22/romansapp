package de.roman.speiseplan.household;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import de.roman.speiseplan.auth.TokenService;
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

@SpringBootTest
@AutoConfigureMockMvc
class HouseholdIsolationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TokenService tokenService;

    @Test
    void householdsAreIsolatedUntilSomeoneJoinsWithInviteCode() throws Exception {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        String alice = token("alice-" + suffix + "@example.com");
        String bob = token("bob-" + suffix + "@example.com");

        JsonNode plan = json(mockMvc.perform(auth(post("/api/plans"), alice)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Alices Woche\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString());
        long planId = plan.get("id").asLong();
        mockMvc.perform(auth(post("/api/shopping-list"), alice)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"ingredientName\":\"Alices Milch\",\"quantity\":1,\"unit\":\"l\"}"))
                .andExpect(status().isCreated());

        assertThat(body(auth(get("/api/plans"), alice))).contains("Alices Woche");
        assertThat(body(auth(get("/api/plans"), bob))).doesNotContain("Alices Woche");
        assertThat(body(get("/api/plans"))).doesNotContain("Alices Woche");
        assertThat(body(auth(get("/api/shopping-list"), bob))).doesNotContain("Alices Milch");
        mockMvc.perform(auth(get("/api/plans/" + planId + "/dishes"), bob)).andExpect(status().isNotFound());
        mockMvc.perform(auth(put("/api/plans/" + planId + "/cost"), bob)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"costEur\":12.5}"))
                .andExpect(status().isNotFound());

        // Public creator plans stay visible for everybody
        assertThat(body(auth(get("/api/creators"), bob))).contains("Mia Sommer");

        JsonNode invite = json(body(auth(post("/api/household/invite"), alice)));
        String code = invite.get("inviteCode").asString();
        assertThat(code).hasSize(8);

        mockMvc.perform(auth(post("/api/household/join"), bob)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"code\":\"" + code.toLowerCase() + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.members.length()").value(2))
                .andExpect(jsonPath("$.role").value("MEMBER"));

        assertThat(body(auth(get("/api/plans"), bob))).contains("Alices Woche");
        assertThat(body(auth(get("/api/shopping-list"), bob))).contains("Alices Milch");

        mockMvc.perform(auth(post("/api/household/leave"), bob)).andExpect(status().isOk());
        assertThat(body(auth(get("/api/plans"), bob))).doesNotContain("Alices Woche");
    }

    @Test
    void invalidInviteCodeIsRejectedAndWritesNeedLogin() throws Exception {
        String carol = token("carol-" + UUID.randomUUID().toString().substring(0, 8) + "@example.com");
        mockMvc.perform(auth(post("/api/household/join"), carol)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"code\":\"NOPE1234\"}"))
                .andExpect(status().isNotFound());
        mockMvc.perform(post("/api/household/invite")).andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/household"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.authenticated").value(false))
                .andExpect(jsonPath("$.inviteCode").doesNotExist());
    }

    private String token(String email) {
        return tokenService.issueToken(Map.of("email", email));
    }

    private static MockHttpServletRequestBuilder auth(MockHttpServletRequestBuilder builder, String token) {
        return builder.header("Authorization", "Bearer " + token);
    }

    private String body(MockHttpServletRequestBuilder request) throws Exception {
        return mockMvc.perform(request).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    }

    private JsonNode json(String body) {
        return objectMapper.readTree(body);
    }
}
