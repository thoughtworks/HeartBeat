package heartbeat.controller.version;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.json.AutoConfigureJsonTesters;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(VersionController.class)
@ExtendWith(SpringExtension.class)
@AutoConfigureJsonTesters
class VersionControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Value("${heartbeat.version}")
	private String version;

	@Test
	void shouldReturnHeartBeatVersion() throws Exception {

		final var response = mockMvc.perform(get("/version")).andExpect(status().isOk()).andReturn().getResponse();
		final var content = response.getContentAsString();
		final var result = JsonPath.parse(content).read("$.version").toString();

		assertThat(result).isEqualTo(version);
	}

}
