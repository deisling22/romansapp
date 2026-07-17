package de.roman.speiseplan.plan;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class MealPlanControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getPlansReturnsSeedData() throws Exception {
        mockMvc.perform(get("/api/plans"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", greaterThanOrEqualTo(2)));
    }

    @Test
    void createUpdateCopyAndDeletePlanLifecycle() throws Exception {
        String createBody = objectMapper.writeValueAsString(new CreatePlanRequest("Test-Plan"));
        String response = mockMvc.perform(post("/api/plans")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Test-Plan"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        long planId = objectMapper.readTree(response).get("id").asLong();

        MockMultipartFile image = new MockMultipartFile("image", "dish.jpg", "image/jpeg", new byte[] {1, 2, 3});
        mockMvc.perform(multipart("/api/plans/{planId}/dishes", planId)
                        .file(image)
                        .param("name", "Testgericht"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.imageUrl").value(org.hamcrest.Matchers.startsWith("/uploads/")));

        mockMvc.perform(post("/api/plans/{planId}/copy", planId))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Test-Plan (Kopie)"))
                .andExpect(jsonPath("$.dishCount").value(1));

        mockMvc.perform(delete("/api/plans/{planId}", planId))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/plans/{planId}/dishes", planId))
                .andExpect(status().isNotFound());
    }

    @Test
    void addDishWithInvalidMimeTypeIsRejected() throws Exception {
        long planId = createPlan("Mime-Test-Plan");
        MockMultipartFile image = new MockMultipartFile("image", "dish.txt", "text/plain", "not-an-image".getBytes());
        mockMvc.perform(multipart("/api/plans/{planId}/dishes", planId)
                        .file(image)
                        .param("name", "Ungültiges Bild"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void addDishToUnknownPlanReturnsNotFound() throws Exception {
        MockMultipartFile image = new MockMultipartFile("image", "dish.jpg", "image/jpeg", new byte[] {1, 2, 3});
        mockMvc.perform(multipart("/api/plans/{planId}/dishes", 999999L)
                        .file(image)
                        .param("name", "Testgericht"))
                .andExpect(status().isNotFound());
    }

    private long createPlan(String name) throws Exception {
        String createBody = objectMapper.writeValueAsString(new CreatePlanRequest(name));
        String response = mockMvc.perform(post("/api/plans")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createBody))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        return objectMapper.readTree(response).get("id").asLong();
    }
}
