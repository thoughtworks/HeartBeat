package heartbeat.controller.pipeline;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import heartbeat.controller.pipeline.dto.request.TokenParam;
import heartbeat.controller.pipeline.dto.response.BuildKiteResponseDTO;
import heartbeat.controller.pipeline.dto.response.Pipeline;
import heartbeat.controller.pipeline.dto.response.PipelineStepsDTO;
import heartbeat.service.pipeline.buildkite.BuildKiteService;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
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

	public static final String TEST_TOKEN = "test_token";

	public static final String BUILD_KITE = "buildkite";

	@MockBean
	private BuildKiteService buildKiteService;

	@Autowired
	private MockMvc mockMvc;

	@Test
	void shouldReturnCorrectPipelineStepsWhenCalBuildKiteMockServer() throws Exception {
		List<String> steps = List.of(":docker: publish image to cloudsmith", ":maven: :wrench: Build");
		PipelineStepsDTO pipelineStepsDTO = PipelineStepsDTO.builder().steps(steps).build();
		when(buildKiteService.fetchPipelineSteps(anyString(), anyString(), anyString(), any()))
			.thenReturn(pipelineStepsDTO);

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

	@Test
	void shouldReturnNoContentIfNoStepsWhenCallBuildKite() throws Exception {
		List<String> steps = new ArrayList<>();
		PipelineStepsDTO emptyPipelineSteps = PipelineStepsDTO.builder().steps(steps).build();
		when(buildKiteService.fetchPipelineSteps(anyString(), anyString(), anyString(), any()))
			.thenReturn(emptyPipelineSteps);

		MockHttpServletResponse response = mockMvc
			.perform(get("/pipelines/buildkite/XXXX/pipelines/fs-platform-onboarding/steps")
				.header("Authorization", "mockBuildKiteToken")
				.queryParam("pipelineName", "Heartbeat")
				.queryParam("repository", "git@github.com:au-heartbeat/Heartbeat.git")
				.queryParam("orgName", "Thoughtworks-Heartbeat")
				.queryParam("startTime", "1687708800000")
				.queryParam("endTime", "1689004799999")
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isNoContent())
			.andReturn()
			.getResponse();

		assertThat(response.getContentAsString()).isEqualTo("");
	}

	@Test
	void shouldReturnNoContentWhenCorrectTokenCallBuildKite() throws Exception {
		ObjectMapper mapper = new ObjectMapper();
		TokenParam tokenParam = TokenParam.builder().token(TEST_TOKEN).build();
		doNothing().when(buildKiteService).verifyToken(any());

		MockHttpServletResponse response = mockMvc
			.perform(post("/pipelines/{pipelineType}/verify", BUILD_KITE).contentType(MediaType.APPLICATION_JSON)
				.content(mapper.writeValueAsString(tokenParam)))
			.andExpect(status().isNoContent())
			.andReturn()
			.getResponse();

		assertThat(response.getContentAsString()).isEqualTo("");
	}

	@Test
	void shouldReturnPipelineInfoWhenCorrectTokenCallBuildKite() throws Exception {
		ObjectMapper mapper = new ObjectMapper();
		List<Pipeline> pipelines = mapper.readValue(
				new File("src/test/java/heartbeat/controller/pipeline/pipelineInfoData.json"), new TypeReference<>() {
				});
		BuildKiteResponseDTO buildKiteResponseDTO = BuildKiteResponseDTO.builder().pipelineList(pipelines).build();
		TokenParam tokenParam = TokenParam.builder().token(TEST_TOKEN).build();
		when(buildKiteService.getBuildKiteInfo(any())).thenReturn(buildKiteResponseDTO);

		MockHttpServletResponse response = mockMvc
			.perform(post("/pipelines/{pipelineType}/info", BUILD_KITE).contentType(MediaType.APPLICATION_JSON)
				.content(mapper.writeValueAsString(tokenParam)))
			.andExpect(status().isOk())
			.andReturn()
			.getResponse();

		final var resultId = JsonPath.parse(response.getContentAsString()).read("$.pipelineList[0].id").toString();
		assertThat(resultId).contains("payment-selector-ui");
		final var resultName = JsonPath.parse(response.getContentAsString()).read("$.pipelineList[0].name").toString();
		assertThat(resultName).contains("payment-selector-ui");
	}

	@Test
	void shouldReturnNoContentGivenPipelineInfoIsNullWhenCallingBuildKite() throws Exception {
		ObjectMapper mapper = new ObjectMapper();
		BuildKiteResponseDTO buildKiteResponseDTO = BuildKiteResponseDTO.builder()
			.pipelineList(Collections.emptyList())
			.build();
		TokenParam tokenParam = TokenParam.builder().token(TEST_TOKEN).build();
		when(buildKiteService.getBuildKiteInfo(any())).thenReturn(buildKiteResponseDTO);

		MockHttpServletResponse response = mockMvc
			.perform(post("/pipelines/{pipelineType}/info", BUILD_KITE).contentType(MediaType.APPLICATION_JSON)
				.content(mapper.writeValueAsString(tokenParam)))
			.andExpect(status().isNoContent())
			.andReturn()
			.getResponse();

		assertThat(response.getContentAsString()).isEqualTo("");
	}

}
