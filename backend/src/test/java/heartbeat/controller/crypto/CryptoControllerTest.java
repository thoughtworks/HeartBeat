package heartbeat.controller.crypto;

import com.fasterxml.jackson.databind.ObjectMapper;
import heartbeat.controller.crypto.request.EncryptRequest;
import heartbeat.service.crypto.EncryptDecryptService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.AutoConfigureJsonTesters;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CryptoController.class)
@ExtendWith(SpringExtension.class)
@AutoConfigureJsonTesters
class CryptoControllerTest {

	@Autowired
	MockMvc mockMvc;

	@MockBean
	EncryptDecryptService encryptDecryptService;

	@Test
	void shouldReturnOkStatusAndEncryptedData() throws Exception {
		//given
		String fakeEncryptedData = "fakeEncryptedData";
		EncryptRequest request = EncryptRequest.builder().configData("fakeConfig").password("fakePassword").build();
		//when
		when(encryptDecryptService.encryptConfigData(any(), any())).thenReturn(fakeEncryptedData);
		//then
		mockMvc
			.perform(post("/encrypt").content(new ObjectMapper().writeValueAsString(request))
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.encryptedData").value(fakeEncryptedData));
	}
}
