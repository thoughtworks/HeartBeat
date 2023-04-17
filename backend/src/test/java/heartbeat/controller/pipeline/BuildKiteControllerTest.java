package heartbeat.controller.pipeline;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import heartbeat.controller.pipeline.dto.response.BuildKiteResponse;
import heartbeat.controller.pipeline.dto.response.Pipeline;
import heartbeat.controller.pipeline.dto.response.PipelineStepsResponse;
import heartbeat.service.pipeline.buildkite.BuildKiteService;
import java.io.File;
import java.util.List;
import lombok.val;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.AutoConfigureJsonTesters;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(PipelineController.class)
@ExtendWith(SpringExtension.class)
@AutoConfigureJsonTesters
public class BuildKiteControllerTest {

	@MockBean
	private BuildKiteService buildKiteService;

	@Autowired
	private MockMvc mockMvc;

	@Test
	void shouldReturnCorrectPipelineInfoWhenCallBuildKiteMockServer() throws Exception {
		ObjectMapper mapper = new ObjectMapper();
		List<Pipeline> pipelines = mapper.readValue(
				new File("src/test/java/heartbeat/controller/pipeline/pipelineInfoData.json"), new TypeReference<>() {
				});
		BuildKiteResponse buildKiteResponse = BuildKiteResponse.builder().pipelineList(pipelines).build();
		when(buildKiteService.fetchPipelineInfo(any())).thenReturn(buildKiteResponse);
		MockHttpServletResponse response = mockMvc
			.perform(get("/pipelines/buildKite").contentType(MediaType.APPLICATION_JSON)
				.queryParam("token", "test_token")
				.queryParam("startTime", "16737733")
				.queryParam("endTime", "17657557"))
			.andExpect(status().isOk())
			.andReturn()
			.getResponse();
		final var resultId = JsonPath.parse(response.getContentAsString()).read("$.pipelineList[0].id").toString();
		assertThat(resultId).contains("payment-selector-ui");
		final var resultName = JsonPath.parse(response.getContentAsString()).read("$.pipelineList[0].name").toString();
		assertThat(resultName).contains("payment-selector-ui");
	}

	@Test
	void shouldReturnCorrectPipelineStepsWhenCalBuildKiteMockServer() throws Exception {
		List<String> steps = List.of(":docker: publish image to cloudsmith", ":maven: :wrench: Build");
		PipelineStepsResponse pipelineStepsResponse = PipelineStepsResponse.builder().steps(steps).build();
		when(buildKiteService.fetchPipelineSteps(anyString(), anyString(), anyString(), any()))
			.thenReturn(pipelineStepsResponse);

		MockHttpServletResponse response = mockMvc
			.perform(get("/pipelines/buildkite/XXXX/pipelines/fs-platform-onboarding/steps")
				.header("Authorization", "token")
				.queryParam("pipelineName", "fs-platform-onboarding")
				.queryParam("repository", "XXXX-repo")
				.queryParam("orgName", "XXXX")
				.queryParam("startTime", "2023")
				.queryParam("endTime", "2023")
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk())
			.andReturn()
			.getResponse();
		val resultStep = JsonPath.parse(response.getContentAsString()).read("$.steps[0]");
		assertThat(resultStep).isEqualTo(":docker: publish image to cloudsmith");
	}

}
