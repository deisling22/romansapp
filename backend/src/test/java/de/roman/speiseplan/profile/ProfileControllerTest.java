package de.roman.speiseplan.profile;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class ProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getAndUpdateProfile() throws Exception {
        mockMvc.perform(get("/api/profile")).andExpect(status().isOk());

        String body = objectMapper.writeValueAsString(new ProfileUpdateRequest(1.5, 82.0, 181.0, true));
        mockMvc.perform(put("/api/profile").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.defaultPortionSize").value(1.5))
                .andExpect(jsonPath("$.bodyWeightKg").value(82.0))
                .andExpect(jsonPath("$.bodyHeightCm").value(181.0))
                .andExpect(jsonPath("$.nutritionTrackingEnabled").value(true));
    }
}
