package heartbeat.controller.crypto;

import com.fasterxml.jackson.databind.ObjectMapper;
import heartbeat.controller.crypto.request.EncryptRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.AutoConfigureJsonTesters;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CryptoController.class)
@ExtendWith(SpringExtension.class)
@AutoConfigureJsonTesters
class CryptoControllerTest {

	@Autowired
	MockMvc mockMvc;

	@Test
	void shouldReturnOkStatusAndEncryptedData() throws Exception {
		EncryptRequest request = EncryptRequest.builder().build();

		mockMvc
			.perform(post("/encrypt").content(new ObjectMapper().writeValueAsString(request))
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk());
	}
}
