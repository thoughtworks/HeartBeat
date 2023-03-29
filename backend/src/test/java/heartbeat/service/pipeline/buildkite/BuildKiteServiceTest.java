package heartbeat.service.pipeline.buildkite;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hibernate.validator.internal.util.Contracts.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import feign.FeignException;
import heartbeat.client.BuildKiteFeignClient;
import heartbeat.client.dto.BuildKiteBuildInfo;
import heartbeat.client.dto.BuildKiteJob;
import heartbeat.client.dto.BuildKiteOrganizationsInfo;
import heartbeat.client.dto.BuildKitePipelineDTO;
import heartbeat.controller.pipeline.vo.request.PipelineStepsParam;
import heartbeat.controller.pipeline.vo.response.BuildKiteResponse;
import heartbeat.controller.pipeline.vo.response.Pipeline;
import heartbeat.controller.pipeline.vo.response.PipelineStepsResponse;
import heartbeat.exception.RequestFailedException;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class BuildKiteServiceTest {

	public static final String TOTAL_PAGE_HEADER = """
			<https://api.buildkite.com/v2/organizations/test_org_id/pipelines/test_pipeline_id/builds?page=1&per_page=100>; rel="first",
			<https://api.buildkite.com/v2/organizations/test_org_id/pipelines/test_pipeline_id/builds?page=1&per_page=100>; rel="prev",
			<https://api.buildkite.com/v2/organizations/test_org_id/pipelines/test_pipeline_id/builds?per_page=100&page=2>; rel="next",
			<https://api.buildkite.com/v2/organizations/test_org_id/pipelines/test_pipeline_id/builds?page=3&per_page=100>; rel="last"
			""";

	public static final String NONE_TOTAL_PAGE_HEADER = """
			<https://api.buildkite.com/v2/organizations/test_org_id/pipelines/test_pipeline_id/builds?page=1&per_page=100>; rel="first",
			<https://api.buildkite.com/v2/organizations/test_org_id/pipelines/test_pipeline_id/builds?page=1&per_page=100>; rel="prev",
			<https://api.buildkite.com/v2/organizations/test_org_id/pipelines/test_pipeline_id/builds?per_page=100&page=2>; rel="next"
			""";

	@Mock
	BuildKiteFeignClient buildKiteFeignClient;

	@InjectMocks
	BuildKiteService buildKiteService;

	@Test
	void shouldReturnBuildKiteResponseWhenCallBuildKiteApi() throws IOException {
		ObjectMapper mapper = new ObjectMapper();
		List<BuildKitePipelineDTO> pipelineDTOS = mapper.readValue(
				new File("src/test/java/heartbeat/controller/pipeline/buildKitePipelineInfoData.json"),
				new TypeReference<>() {
				});
		when(buildKiteFeignClient.getBuildKiteOrganizationsInfo())
			.thenReturn(List.of(BuildKiteOrganizationsInfo.builder().name("XXXX").slug("XXXX").build()));
		when(buildKiteFeignClient.getPipelineInfo("XXXX", "1", "100")).thenReturn(pipelineDTOS);

		BuildKiteResponse buildKiteResponse = buildKiteService.fetchPipelineInfo();

		assertThat(buildKiteResponse.getPipelineList().size()).isEqualTo(1);
		Pipeline pipeline = buildKiteResponse.getPipelineList().get(0);
		assertThat(pipeline.getId()).isEqualTo("0186104b-aa31-458c-a58c-63266806f2fe");
		assertThat(pipeline.getName()).isEqualTo("payment-selector-ui");
		assertThat(pipeline.getOrgId()).isEqualTo("XXXX");
		assertThat(pipeline.getOrgName()).isEqualTo("XXXX");
		assertThat(pipeline.getRepository())
			.isEqualTo("https://github.com/XXXX-fs/fs-platform-payment-selector-ui.git");
		assertThat(pipeline.getSteps().size()).isEqualTo(1);
	}

	@Test
	void shouldThrowRequestFailedExceptionWhenFeignClientCallFailed() {
		FeignException feignException = mock(FeignException.class);
		when(buildKiteFeignClient.getBuildKiteOrganizationsInfo()).thenThrow(feignException);

		assertThrows(RequestFailedException.class, () -> buildKiteService.fetchPipelineInfo());

		verify(buildKiteFeignClient).getBuildKiteOrganizationsInfo();
	}

	@Test
	public void shouldReturnResponseWhenFetchPipelineStepsSuccess() {
		String token = "test_token";
		String organizationId = "test_org_id";
		String pipelineId = "test_pipeline_id";
		PipelineStepsParam stepsParam = new PipelineStepsParam();
		stepsParam.setStartTime("2023-01-01T00:00:00Z");
		stepsParam.setEndTime("2023-09-01T00:00:00Z");
		BuildKiteJob testJob = BuildKiteJob.builder().name("testJob").build();
		List<BuildKiteBuildInfo> buildKiteBuildInfoList = new ArrayList<>();
		buildKiteBuildInfoList.add(BuildKiteBuildInfo.builder().jobs(List.of(testJob)).build());
		ResponseEntity<List<BuildKiteBuildInfo>> responseEntity = new ResponseEntity<>(buildKiteBuildInfoList,
				HttpStatus.OK);
		when(buildKiteFeignClient.getPipelineSteps(anyString(), anyString(), anyString(), anyString(), anyString(),
				anyString(), anyString()))
			.thenReturn(responseEntity);

		PipelineStepsResponse pipelineStepsResponse = buildKiteService.fetchPipelineSteps(token, organizationId,
				pipelineId, stepsParam);

		assertNotNull(pipelineStepsResponse);
		assertThat(pipelineStepsResponse.getSteps().get(0)).isEqualTo("testJob");
	}

	@Test
	public void shouldThrowRequestFailedExceptionWhenFetchPipelineStepsWithException() {
		RequestFailedException mockException = mock(RequestFailedException.class);
		when(mockException.getMessage()).thenReturn("exception");
		when(mockException.getStatus()).thenReturn(500);
		when(buildKiteFeignClient.getPipelineSteps(anyString(), anyString(), anyString(), anyString(), anyString(),
				any(), any()))
			.thenThrow(mockException);

		assertThrows(
				RequestFailedException.class, () -> buildKiteService.fetchPipelineSteps("test_token", "test_org_id",
						"test_pipeline_id", new PipelineStepsParam()),
				"Request failed with status code 500, error: exception");
	}

	@Test
	public void shouldReturnMoreThanOnePageStepsWhenPageFetchPipelineSteps() {
		PipelineStepsParam stepsParam = new PipelineStepsParam();
		stepsParam.setStartTime("2023-01-01T00:00:00Z");
		stepsParam.setEndTime("2023-09-01T00:00:00Z");
		List<String> linkHeader = new ArrayList<>();
		linkHeader.add(TOTAL_PAGE_HEADER);
		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.addAll(HttpHeaders.LINK, linkHeader);
		List<BuildKiteBuildInfo> buildKiteBuildInfoList = new ArrayList<>();
		BuildKiteJob testJob = BuildKiteJob.builder().name("testJob").build();
		BuildKiteJob testJob2 = BuildKiteJob.builder().name("testJob2").build();
		buildKiteBuildInfoList.add(BuildKiteBuildInfo.builder().jobs(List.of(testJob, testJob2)).build());
		ResponseEntity<List<BuildKiteBuildInfo>> responseEntity = new ResponseEntity<>(buildKiteBuildInfoList,
				httpHeaders, HttpStatus.OK);
		when(buildKiteFeignClient.getPipelineSteps(anyString(), anyString(), anyString(), anyString(), anyString(),
				anyString(), anyString()))
			.thenReturn(responseEntity);
		BuildKiteJob testJob3 = BuildKiteJob.builder().name("testJob3").build();
		BuildKiteJob testJob4 = BuildKiteJob.builder().name("").build();
		List<BuildKiteBuildInfo> buildKiteBuildInfoList2 = new ArrayList<>();
		buildKiteBuildInfoList2.add(BuildKiteBuildInfo.builder().jobs(List.of(testJob3, testJob4)).build());
		when(buildKiteFeignClient.getPipelineStepsInfo(anyString(), anyString(), anyString(), anyString(), anyString(),
				anyString(), anyString()))
			.thenReturn(buildKiteBuildInfoList2);

		PipelineStepsResponse pipelineStepsResponse = buildKiteService.fetchPipelineSteps("test_token", "test_org_id",
				"test_pipeline_id", stepsParam);

		assertNotNull(pipelineStepsResponse);
		assertThat(pipelineStepsResponse.getSteps().size()).isEqualTo(3);
		assertThat(pipelineStepsResponse.getSteps().get(0)).isEqualTo("testJob");
		assertThat(pipelineStepsResponse.getSteps().get(1)).isEqualTo("testJob2");
		assertThat(pipelineStepsResponse.getSteps().get(2)).isEqualTo("testJob3");
	}

	@Test
	public void shouldRThrowServerErrorWhenPageFetchPipelineStepsAndFetchNextPage404Exception() {
		List<String> linkHeader = new ArrayList<>();
		linkHeader.add(TOTAL_PAGE_HEADER);
		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.addAll(HttpHeaders.LINK, linkHeader);
		List<BuildKiteBuildInfo> buildKiteBuildInfoList = new ArrayList<>();
		BuildKiteJob testJob = BuildKiteJob.builder().name("testJob").build();
		buildKiteBuildInfoList.add(BuildKiteBuildInfo.builder().jobs(List.of(testJob)).build());
		ResponseEntity<List<BuildKiteBuildInfo>> responseEntity = new ResponseEntity<>(buildKiteBuildInfoList,
				httpHeaders, HttpStatus.OK);
		when(buildKiteFeignClient.getPipelineSteps(anyString(), anyString(), anyString(), anyString(), anyString(),
				any(), any()))
			.thenReturn(responseEntity);
		when(buildKiteFeignClient.getPipelineStepsInfo(anyString(), anyString(), anyString(), anyString(), anyString(),
				any(), any()))
			.thenThrow(new RequestFailedException(404, "Client Error"));

		assertThrows(
				RequestFailedException.class, () -> buildKiteService.fetchPipelineSteps("test_token", "test_org_id",
						"test_pipeline_id", new PipelineStepsParam()),
				"Request failed with status statusCode 500, error: Server Error");
	}

	@Test
	public void shouldThrowServerErrorWhenPageFetchPipelineStepsAndFetchNextPage500Exception() {
		List<String> linkHeader = new ArrayList<>();
		linkHeader.add(TOTAL_PAGE_HEADER);
		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.addAll(HttpHeaders.LINK, linkHeader);
		List<BuildKiteBuildInfo> buildKiteBuildInfoList = new ArrayList<>();
		BuildKiteJob testJob = BuildKiteJob.builder().name("testJob").build();
		buildKiteBuildInfoList.add(BuildKiteBuildInfo.builder().jobs(List.of(testJob)).build());
		ResponseEntity<List<BuildKiteBuildInfo>> responseEntity = new ResponseEntity<>(buildKiteBuildInfoList,
				httpHeaders, HttpStatus.OK);
		when(buildKiteFeignClient.getPipelineSteps(anyString(), anyString(), anyString(), anyString(), anyString(),
				any(), any()))
			.thenReturn(responseEntity);
		when(buildKiteFeignClient.getPipelineStepsInfo(anyString(), anyString(), anyString(), anyString(), anyString(),
				any(), any()))
			.thenThrow(new RequestFailedException(500, "Server Error"));

		assertThrows(
				RequestFailedException.class, () -> buildKiteService.fetchPipelineSteps("test_token", "test_org_id",
						"test_pipeline_id", new PipelineStepsParam()),
				"Request failed with status statusCode 500, error: Server Error");
	}

	@Test
	public void shouldReturnOnePageStepsWhenPageFetchPipelineStepsAndHeaderParseOnePage() {
		PipelineStepsParam stepsParam = new PipelineStepsParam();
		stepsParam.setStartTime("2023-01-01T00:00:00Z");
		stepsParam.setEndTime("2023-09-01T00:00:00Z");
		List<String> linkHeader = new ArrayList<>();
		linkHeader.add(NONE_TOTAL_PAGE_HEADER);
		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.addAll(HttpHeaders.LINK, linkHeader);
		List<BuildKiteBuildInfo> buildKiteBuildInfoList = new ArrayList<>();
		BuildKiteJob testJob = BuildKiteJob.builder().name("testJob").build();
		buildKiteBuildInfoList.add(BuildKiteBuildInfo.builder().jobs(List.of(testJob)).build());
		ResponseEntity<List<BuildKiteBuildInfo>> responseEntity = new ResponseEntity<>(buildKiteBuildInfoList,
				httpHeaders, HttpStatus.OK);
		when(buildKiteFeignClient.getPipelineSteps(anyString(), anyString(), anyString(), anyString(), anyString(),
				anyString(), anyString()))
			.thenReturn(responseEntity);

		PipelineStepsResponse pipelineStepsResponse = buildKiteService.fetchPipelineSteps("test_token", "test_org_id",
				"test_pipeline_id", stepsParam);

		assertNotNull(pipelineStepsResponse);
		assertThat(pipelineStepsResponse.getSteps().size()).isEqualTo(1);
		assertThat(pipelineStepsResponse.getSteps().get(0)).isEqualTo("testJob");
	}

	@Test
	public void shouldReturnOnePageStepsWhenPageFetchPipelineStep() {
		PipelineStepsParam stepsParam = new PipelineStepsParam();
		stepsParam.setStartTime("2023-01-01T00:00:00Z");
		stepsParam.setEndTime("2023-09-01T00:00:00Z");
		List<String> linkHeader = new ArrayList<>();
		linkHeader.add(NONE_TOTAL_PAGE_HEADER);
		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.addAll(HttpHeaders.LINK, linkHeader);
		ResponseEntity<List<BuildKiteBuildInfo>> responseEntity = new ResponseEntity<>(null, httpHeaders,
				HttpStatus.OK);
		when(buildKiteFeignClient.getPipelineSteps(anyString(), anyString(), anyString(), anyString(), anyString(),
				anyString(), anyString()))
			.thenReturn(responseEntity);

		PipelineStepsResponse pipelineStepsResponse = buildKiteService.fetchPipelineSteps("test_token", "test_org_id",
				"test_pipeline_id", stepsParam);

		assertNotNull(pipelineStepsResponse);
		assertThat(pipelineStepsResponse.getSteps().size()).isEqualTo(0);
	}

}
