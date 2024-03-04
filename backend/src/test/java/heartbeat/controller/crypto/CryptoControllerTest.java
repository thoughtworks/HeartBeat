package heartbeat.controller.crypto;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import heartbeat.controller.crypto.request.DecryptRequest;
import heartbeat.controller.crypto.request.EncryptRequest;
import heartbeat.exception.DecryptDataOrPasswordWrongException;
import heartbeat.exception.EncryptDecryptProcessException;
import heartbeat.service.crypto.EncryptDecryptService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.AutoConfigureJsonTesters;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CryptoController.class)
@ExtendWith(SpringExtension.class)
@AutoConfigureJsonTesters
class CryptoControllerTest {

	private static final String FAKE_EXCEPTION_MESSAGE = "Encrypt process message";

	@Autowired
	MockMvc mockMvc;

	@MockBean
	EncryptDecryptService encryptDecryptService;

	@Test
	void shouldReturnOkStatusAndEncryptedData() throws Exception {
		// given
		String fakeEncryptedData = "fakeEncryptedData";
		EncryptRequest request = EncryptRequest.builder().configData("fakeConfig").password("fakePassword1").build();
		// when
		when(encryptDecryptService.encryptConfigData(any(), any())).thenReturn(fakeEncryptedData);
		// then
		var response = mockMvc
			.perform(post("/encrypt").content(new ObjectMapper().writeValueAsString(request))
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk())
			.andReturn()
			.getResponse();

		final var content = response.getContentAsString();
		final var result = JsonPath.parse(content).read("$.encryptedData").toString();
		assertThat(result).isEqualTo(fakeEncryptedData);
	}

	@ParameterizedTest
	@NullSource
	@ValueSource(strings = { "" })
	void shouldReturn400StatusWhenConfigDataIsBlankOrNull(String invalidConfigData) throws Exception {
		// given
		String fakeEncryptedData = "fakeEncryptedData";
		EncryptRequest request = EncryptRequest.builder().configData(invalidConfigData).password("password").build();
		// when
		when(encryptDecryptService.encryptConfigData(any(), any())).thenReturn(fakeEncryptedData);
		// then
		var response = mockMvc
			.perform(post("/encrypt").content(new ObjectMapper().writeValueAsString(request))
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isBadRequest())
			.andReturn()
			.getResponse();

		final var content = response.getContentAsString();
		final var result = JsonPath.parse(content).read("$.configData").toString();
		assertThat(result).isEqualTo("ConfigData cannot be blank.");
	}

	@Test
	void shouldReturn400StatusWhenPasswordIsNull() throws Exception {
		// given
		EncryptRequest request = EncryptRequest.builder().configData("fakeConfig").password(null).build();
		// when & then
		var response = mockMvc
			.perform(post("/encrypt").content(new ObjectMapper().writeValueAsString(request))
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isBadRequest())
			.andReturn()
			.getResponse();

		final var content = response.getContentAsString();
		final var result = JsonPath.parse(content).read("$.password").toString();
		assertThat(result).isEqualTo("Password cannot be null.");
	}

	@ParameterizedTest
	@ValueSource(strings = { "Aa345678901234567890123456789012345678901234567890A", "A2345", "#$%^&*@!", "123456", "" })
	void shouldReturn400StatusWhenPasswordIsWrong(String invalidPassword) throws Exception {
		// given
		EncryptRequest request = EncryptRequest.builder().configData("fakeConfig").password(invalidPassword).build();
		// when & then
		var response = mockMvc
			.perform(post("/encrypt").content(new ObjectMapper().writeValueAsString(request))
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isBadRequest())
			.andReturn()
			.getResponse();

		final var content = response.getContentAsString();
		final var result = JsonPath.parse(content).read("$.password").toString();
		assertThat(result)
			.isEqualTo("Password length can only be within 6-50 characters and contain letters and numbers.");
	}

	@Test
	void shouldReturn500StatusWhenServiceThrowException() throws Exception {
		// given
		EncryptRequest request = EncryptRequest.builder().configData("fakeConfig").password("A234567890").build();
		// when
		when(encryptDecryptService.encryptConfigData(any(), any()))
			.thenThrow(new EncryptDecryptProcessException(FAKE_EXCEPTION_MESSAGE));
		// then
		var response = mockMvc
			.perform(post("/encrypt").content(new ObjectMapper().writeValueAsString(request))
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isInternalServerError())
			.andReturn()
			.getResponse();

		final var content = response.getContentAsString();
		final var message = JsonPath.parse(content).read("$.message").toString();
		final var hintInfo = JsonPath.parse(content).read("$.hintInfo").toString();
		assertThat(message).isEqualTo(FAKE_EXCEPTION_MESSAGE);
		assertThat(hintInfo).isEqualTo("Failed to encrypt or decrypt process");
	}

	@Test
	void shouldReturnOkStatusAndConfigData() throws Exception {
		// given
		String fakeEncryptedData = "fakeEncryptedData";
		DecryptRequest request = DecryptRequest.builder()
			.encryptedData("encryptedData")
			.password("fakePassword1")
			.build();
		// when
		when(encryptDecryptService.decryptConfigData(any(), any())).thenReturn(fakeEncryptedData);
		// then
		var response = mockMvc
			.perform(post("/decrypt").content(new ObjectMapper().writeValueAsString(request))
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk())
			.andReturn()
			.getResponse();

		final var content = response.getContentAsString();
		final var result = JsonPath.parse(content).read("$.configData").toString();
		assertThat(result).isEqualTo(fakeEncryptedData);
	}

	@Test
	void shouldReturn400StatusWhenPasswordIsNullInDecryptProcess() throws Exception {
		// given
		DecryptRequest request = DecryptRequest.builder().encryptedData("encryptedData").password(null).build();
		// when & then
		var response = mockMvc
			.perform(post("/decrypt").content(new ObjectMapper().writeValueAsString(request))
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isBadRequest())
			.andReturn()
			.getResponse();

		final var content = response.getContentAsString();
		final var result = JsonPath.parse(content).read("$.password").toString();
		assertThat(result).isEqualTo("Password cannot be null.");
	}

	@ParameterizedTest
	@ValueSource(strings = { "Aa345678901234567890123456789012345678901234567890A", "A2345", "#$%^&*@!", "123456", "" })
	void shouldReturn400StatusWhenPasswordIsWrongInDecryptProcess(String invalidPassword) throws Exception {
		// given
		DecryptRequest request = DecryptRequest.builder()
			.encryptedData("fakeEncryptedData")
			.password(invalidPassword)
			.build();
		// when & then
		var response = mockMvc
			.perform(post("/decrypt").content(new ObjectMapper().writeValueAsString(request))
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isBadRequest())
			.andReturn()
			.getResponse();

		final var content = response.getContentAsString();
		final var result = JsonPath.parse(content).read("$.password").toString();
		assertThat(result)
			.isEqualTo("Password length can only be within 6-50 characters and contain letters and numbers.");
	}

	@Test
	void shouldReturn5xxOr4xxWhenDecryptServiceThrowException() throws Exception {

		DecryptRequest request = DecryptRequest.builder()
			.encryptedData("encryptedData")
			.password("A1234567890")
			.build();

		when(encryptDecryptService.decryptConfigData(any(), any()))
			.thenThrow(new EncryptDecryptProcessException(FAKE_EXCEPTION_MESSAGE))
			.thenThrow(new DecryptDataOrPasswordWrongException(FAKE_EXCEPTION_MESSAGE, HttpStatus.BAD_REQUEST.value()));

		var internalServerResponse = mockMvc
			.perform(post("/decrypt").content(new ObjectMapper().writeValueAsString(request))
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isInternalServerError())
			.andReturn()
			.getResponse();
		final var internalServerContent = internalServerResponse.getContentAsString();
		final var internalServerMessage = JsonPath.parse(internalServerContent).read("$.message").toString();
		final var internalServerHintInfo = JsonPath.parse(internalServerContent).read("$.hintInfo").toString();
		assertThat(internalServerMessage).isEqualTo(FAKE_EXCEPTION_MESSAGE);
		assertThat(internalServerHintInfo).isEqualTo("Failed to encrypt or decrypt process");

		var badRequestResponse = mockMvc
			.perform(post("/decrypt").content(new ObjectMapper().writeValueAsString(request))
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isBadRequest())
			.andReturn()
			.getResponse();

		final var badRequestContent = badRequestResponse.getContentAsString();
		final var badRequestMessage = JsonPath.parse(badRequestContent).read("$.message").toString();
		final var badRequestHintInfo = JsonPath.parse(badRequestContent).read("$.hintInfo").toString();
		assertThat(badRequestMessage).isEqualTo(FAKE_EXCEPTION_MESSAGE);
		assertThat(badRequestHintInfo).isEqualTo("Config file or password error");
	}

}
