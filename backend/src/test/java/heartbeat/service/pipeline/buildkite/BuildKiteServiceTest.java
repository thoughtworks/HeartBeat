package heartbeat.service.pipeline.buildkite;

import heartbeat.exception.CustomFeignClientException;
import heartbeat.exception.InternalServerErrorException;
import heartbeat.exception.ServiceUnavailableException;
import heartbeat.exception.UnauthorizedException;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.hibernate.validator.internal.util.Contracts.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import heartbeat.client.BuildKiteFeignClient;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteBuildInfo;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteJob;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteOrganizationsInfo;
import heartbeat.client.dto.pipeline.buildkite.BuildKitePipelineDTO;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteTokenInfo;
import heartbeat.client.dto.pipeline.buildkite.DeployTimes;
import heartbeat.controller.pipeline.dto.request.DeploymentEnvironment;
import heartbeat.controller.pipeline.dto.request.PipelineParam;
import heartbeat.controller.pipeline.dto.request.PipelineStepsParam;
import heartbeat.controller.pipeline.dto.response.BuildKiteResponseDTO;
import heartbeat.controller.pipeline.dto.response.Pipeline;
import heartbeat.controller.pipeline.dto.response.PipelineStepsDTO;
import heartbeat.exception.NotFoundException;
import heartbeat.exception.PermissionDenyException;
import heartbeat.exception.RequestFailedException;
import heartbeat.service.pipeline.buildkite.builder.BuildKiteBuildInfoBuilder;
import heartbeat.service.pipeline.buildkite.builder.BuildKiteJobBuilder;
import heartbeat.service.pipeline.buildkite.builder.DeployInfoBuilder;
import heartbeat.service.pipeline.buildkite.builder.DeployTimesBuilder;
import heartbeat.service.pipeline.buildkite.builder.DeploymentEnvironmentBuilder;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CompletionException;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

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

	private static final String PASSED_STATE = "passed";

	private static final String FAILED_STATE = "failed";

	private static final String mockStartTime = "1661702400000";

	private static final String mockEndTime = "1662739199000";

	@Mock
	BuildKiteFeignClient buildKiteFeignClient;

	BuildKiteService buildKiteService;

	ThreadPoolTaskExecutor executor;

	@BeforeEach
	public void setUp() {
		buildKiteService = new BuildKiteService(executor = getTaskExecutor(), buildKiteFeignClient);
	}

	public ThreadPoolTaskExecutor getTaskExecutor() {
		ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
		executor.setCorePoolSize(10);
		executor.setMaxPoolSize(100);
		executor.setQueueCapacity(500);
		executor.setKeepAliveSeconds(60);
		executor.setThreadNamePrefix("Heartbeat-");
		executor.initialize();
		return executor;
	}

	@AfterEach
	public void tearDown() {
		buildKiteService.shutdownExecutor();
	}

	@Test
	void shouldReturnBuildKiteResponseWhenCallBuildKiteApi() throws IOException {
		ObjectMapper mapper = new ObjectMapper();
		List<BuildKitePipelineDTO> pipelineDTOS = mapper.readValue(
				new File("src/test/java/heartbeat/controller/pipeline/buildKitePipelineInfoData.json"),
				new TypeReference<>() {
				});
		BuildKiteTokenInfo buildKiteTokenInfo = BuildKiteTokenInfo.builder()
			.scopes(List.of("read_builds", "read_organizations", "read_pipelines"))
			.build();
		PipelineParam pipelineParam = PipelineParam.builder()
			.token("test_token")
			.startTime("startTime")
			.endTime("endTime")
			.build();
		when(buildKiteFeignClient.getBuildKiteOrganizationsInfo(any()))
			.thenReturn(List.of(BuildKiteOrganizationsInfo.builder().name("XXXX").slug("XXXX").build()));
		when(buildKiteFeignClient.getPipelineInfo("Bearer test_token", "XXXX", "1", "100", "startTime", "endTime"))
			.thenReturn(pipelineDTOS);
		when(buildKiteFeignClient.getTokenInfo(any())).thenReturn(buildKiteTokenInfo);

		BuildKiteResponseDTO buildKiteResponseDTO = buildKiteService.fetchPipelineInfo(pipelineParam);

		assertThat(buildKiteResponseDTO.getPipelineList().size()).isEqualTo(1);
		Pipeline pipeline = buildKiteResponseDTO.getPipelineList().get(0);
		assertThat(pipeline.getId()).isEqualTo("payment-selector-ui");
		assertThat(pipeline.getName()).isEqualTo("payment-selector-ui");
		assertThat(pipeline.getOrgId()).isEqualTo("XXXX");
		assertThat(pipeline.getOrgName()).isEqualTo("XXXX");
		assertThat(pipeline.getRepository())
			.isEqualTo("https://github.com/XXXX-fs/fs-platform-payment-selector-ui.git");
		assertThat(pipeline.getSteps().size()).isEqualTo(1);
	}

	@Test
	void shouldThrowRequestFailedExceptionWhenFeignClientCallFailed() {
		BuildKiteTokenInfo buildKiteTokenInfo = BuildKiteTokenInfo.builder()
			.scopes(List.of("read_builds", "read_organizations", "read_pipelines"))
			.build();
		when(buildKiteFeignClient.getBuildKiteOrganizationsInfo(any()))
			.thenThrow(new CustomFeignClientException(401, "Bad credentials"));
		when(buildKiteFeignClient.getTokenInfo(any())).thenReturn(buildKiteTokenInfo);

		assertThatThrownBy(() -> buildKiteService.fetchPipelineInfo(
				PipelineParam.builder().token("test_token").startTime("startTime").endTime("endTime").build()))
			.isInstanceOf(Exception.class)
			.hasMessageContaining("Bad credentials");

		verify(buildKiteFeignClient).getBuildKiteOrganizationsInfo(any());
	}

	@Test
	void shouldThrowNoPermissionExceptionWhenTokenPermissionDeny() {
		BuildKiteTokenInfo buildKiteTokenInfo = BuildKiteTokenInfo.builder().scopes(List.of("mock")).build();
		when(buildKiteFeignClient.getTokenInfo(any())).thenReturn(buildKiteTokenInfo);

		assertThrows(PermissionDenyException.class, () -> buildKiteService.fetchPipelineInfo(
				PipelineParam.builder().token("test_token").startTime("startTime").endTime("endTime").build()));
	}

	@Test
	public void shouldReturnResponseWhenFetchPipelineStepsSuccess() {
		String token = "test_token";
		String organizationId = "test_org_id";
		String pipelineId = "test_pipeline_id";
		PipelineStepsParam stepsParam = new PipelineStepsParam();
		stepsParam.setStartTime(mockStartTime);
		stepsParam.setEndTime(mockEndTime);
		BuildKiteJob testJob = BuildKiteJob.builder().name("testJob").build();
		List<BuildKiteBuildInfo> buildKiteBuildInfoList = new ArrayList<>();
		buildKiteBuildInfoList.add(BuildKiteBuildInfo.builder()
			.jobs(List.of(testJob))
			.author(BuildKiteBuildInfo.Author.builder().name("xx").build())
			.build());
		ResponseEntity<List<BuildKiteBuildInfo>> responseEntity = new ResponseEntity<>(buildKiteBuildInfoList,
				HttpStatus.OK);
		when(buildKiteFeignClient.getPipelineSteps(anyString(), anyString(), anyString(), anyString(), anyString(),
				anyString(), anyString(), any()))
			.thenReturn(responseEntity);

		PipelineStepsDTO pipelineStepsDTO = buildKiteService.fetchPipelineSteps(token, organizationId, pipelineId,
				stepsParam);

		assertNotNull(pipelineStepsDTO);
		assertThat(pipelineStepsDTO.getSteps().get(0)).isEqualTo("testJob");
	}

	@Test
	public void shouldThrowRequestFailedExceptionWhenFetchPipelineStepsWithException() {
		RequestFailedException mockException = mock(RequestFailedException.class);
		when(mockException.getMessage()).thenReturn("exception");
		when(mockException.getStatus()).thenReturn(500);
		when(buildKiteFeignClient.getPipelineSteps(anyString(), anyString(), anyString(), anyString(), anyString(),
				any(), any(), any()))
			.thenThrow(mockException);

		assertThrows(RequestFailedException.class,
				() -> buildKiteService.fetchPipelineSteps("test_token", "test_org_id", "test_pipeline_id",
						PipelineStepsParam.builder().startTime(mockStartTime).endTime(mockEndTime).build()),
				"Request failed with status code 500, error: exception");
	}

	@Test
	public void shouldReturnMoreThanOnePageStepsWhenPageFetchPipelineSteps() {
		PipelineStepsParam stepsParam = new PipelineStepsParam();
		stepsParam.setStartTime(mockStartTime);
		stepsParam.setEndTime(mockEndTime);
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
				anyString(), anyString(), any()))
			.thenReturn(responseEntity);
		BuildKiteJob testJob3 = BuildKiteJob.builder().name("testJob3").build();
		BuildKiteJob testJob4 = BuildKiteJob.builder().name("").build();
		List<BuildKiteBuildInfo> buildKiteBuildInfoList2 = new ArrayList<>();
		buildKiteBuildInfoList2.add(BuildKiteBuildInfo.builder().jobs(List.of(testJob3, testJob4)).build());
		when(buildKiteFeignClient.getPipelineStepsInfo(anyString(), anyString(), anyString(), anyString(), anyString(),
				anyString(), anyString(), any()))
			.thenReturn(buildKiteBuildInfoList2);

		PipelineStepsDTO pipelineStepsDTO = buildKiteService.fetchPipelineSteps("test_token", "test_org_id",
				"test_pipeline_id", stepsParam);

		assertNotNull(pipelineStepsDTO);
		assertThat(pipelineStepsDTO.getSteps().size()).isEqualTo(3);
		assertThat(pipelineStepsDTO.getSteps().get(0)).isEqualTo("testJob");
		assertThat(pipelineStepsDTO.getSteps().get(1)).isEqualTo("testJob2");
		assertThat(pipelineStepsDTO.getSteps().get(2)).isEqualTo("testJob3");
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
				any(), any(), any()))
			.thenReturn(responseEntity);
		when(buildKiteFeignClient.getPipelineStepsInfo(anyString(), anyString(), anyString(), anyString(), anyString(),
				any(), any(), any()))
			.thenThrow(new CompletionException(new NotFoundException("Client Error")));

		assertThatThrownBy(() -> buildKiteService.fetchPipelineSteps("test_token", "test_org_id", "test_pipeline_id",
				PipelineStepsParam.builder().startTime(mockStartTime).endTime(mockEndTime).build()))
			.isInstanceOf(NotFoundException.class)
			.hasMessageContaining("Client Error");
	}

	@Test
	public void shouldRThrowTimeoutExceptionWhenPageFetchPipelineStepsAndFetchNextPage503Exception() {
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
				any(), any(), any()))
			.thenReturn(responseEntity);
		when(buildKiteFeignClient.getPipelineStepsInfo(anyString(), anyString(), anyString(), anyString(), anyString(),
				any(), any(), any()))
			.thenThrow(new CompletionException(new ServiceUnavailableException("Service Unavailable")));

		assertThatThrownBy(() -> buildKiteService.fetchPipelineSteps("test_token", "test_org_id", "test_pipeline_id",
				PipelineStepsParam.builder().startTime(mockStartTime).endTime(mockEndTime).build()))
			.isInstanceOf(ServiceUnavailableException.class)
			.hasMessageContaining("Service Unavailable");
	}

	@Test
	public void shouldThrowServerErrorWhenPageFetchPipelineStepsAndFetchNextPage5xxException() {
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
				anyString(), anyString(), any()))
			.thenReturn(responseEntity);
		when(buildKiteFeignClient.getPipelineStepsInfo(anyString(), anyString(), anyString(), anyString(), anyString(),
				any(), any(), any()))
			.thenThrow(new RequestFailedException(504, "Server Error"));

		assertThatThrownBy(() -> buildKiteService.fetchPipelineSteps("test_token", "test_org_id", "test_pipeline_id",
				PipelineStepsParam.builder().startTime(mockStartTime).endTime(mockEndTime).build()))
			.isInstanceOf(RequestFailedException.class)
			.hasMessageContaining("Server Error");
	}

	@Test
	public void shouldThrowInternalServerErrorExceptionWhenPageFetchPipelineStepsAndFetchNextPage5xxException() {
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
				anyString(), anyString(), any()))
			.thenReturn(responseEntity);
		when(buildKiteFeignClient.getPipelineStepsInfo(anyString(), anyString(), anyString(), anyString(), anyString(),
				any(), any(), any()))
			.thenReturn(buildKiteBuildInfoList);

		assertThatThrownBy(() -> buildKiteService.fetchPipelineSteps("test_token", "test_org_id", "test_pipeline_id",
				PipelineStepsParam.builder().build()))
			.isInstanceOf(InternalServerErrorException.class)
			.hasMessageContaining("Failed to get pipeline steps");

	}

	@Test
	public void shouldReturnOnePageStepsWhenPageFetchPipelineStepsAndHeaderParseOnePage() {
		PipelineStepsParam stepsParam = new PipelineStepsParam();
		stepsParam.setStartTime(mockStartTime);
		stepsParam.setEndTime(mockEndTime);
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
				anyString(), anyString(), any()))
			.thenReturn(responseEntity);

		PipelineStepsDTO pipelineStepsDTO = buildKiteService.fetchPipelineSteps("test_token", "test_org_id",
				"test_pipeline_id", stepsParam);

		assertNotNull(pipelineStepsDTO);
		assertThat(pipelineStepsDTO.getSteps().size()).isEqualTo(1);
		assertThat(pipelineStepsDTO.getSteps().get(0)).isEqualTo("testJob");
	}

	@Test
	public void shouldReturnOnePageStepsWhenPageFetchPipelineStep() {
		PipelineStepsParam stepsParam = new PipelineStepsParam();
		stepsParam.setStartTime(mockStartTime);
		stepsParam.setEndTime(mockEndTime);
		List<String> linkHeader = new ArrayList<>();
		linkHeader.add(NONE_TOTAL_PAGE_HEADER);
		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.addAll(HttpHeaders.LINK, linkHeader);
		ResponseEntity<List<BuildKiteBuildInfo>> responseEntity = new ResponseEntity<>(null, httpHeaders,
				HttpStatus.OK);
		when(buildKiteFeignClient.getPipelineSteps(anyString(), anyString(), anyString(), anyString(), anyString(),
				anyString(), anyString(), any()))
			.thenReturn(responseEntity);

		PipelineStepsDTO pipelineStepsDTO = buildKiteService.fetchPipelineSteps("test_token", "test_org_id",
				"test_pipeline_id", stepsParam);

		assertNotNull(pipelineStepsDTO);
		assertThat(pipelineStepsDTO.getSteps().size()).isEqualTo(0);
	}

	@Test
	public void shouldReturnBuildKiteBuildInfoWhenFetchPipelineBuilds() {
		String mockToken = "xxxxxxxxxx";
		DeploymentEnvironment mockDeployment = DeploymentEnvironmentBuilder.withDefault().build();
		List<String> linkHeader = new ArrayList<>();
		linkHeader.add(NONE_TOTAL_PAGE_HEADER);
		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.addAll(HttpHeaders.LINK, linkHeader);
		ResponseEntity<List<BuildKiteBuildInfo>> responseEntity = new ResponseEntity<>(null, httpHeaders,
				HttpStatus.OK);

		when(buildKiteFeignClient.getPipelineSteps(anyString(), anyString(), anyString(), anyString(), anyString(),
				anyString(), anyString(), any()))
			.thenReturn(responseEntity);
		List<BuildKiteBuildInfo> pipelineBuilds = buildKiteService.fetchPipelineBuilds(mockToken, mockDeployment,
				mockStartTime, mockEndTime);

		assertNotNull(pipelineBuilds);
		assertThat(pipelineBuilds.size()).isEqualTo(0);
	}

	@Test
	public void shouldThrowUnauthorizedExceptionWhenFetchPipelineBuilds401Exception() {
		String mockToken = "xxxxxxxxxx";
		DeploymentEnvironment mockDeployment = DeploymentEnvironmentBuilder.withDefault().build();

		when(buildKiteFeignClient.getPipelineSteps(anyString(), anyString(), anyString(), anyString(), anyString(),
				anyString(), anyString(), any()))
			.thenThrow(new UnauthorizedException("unauthorized"));

		Assertions
			.assertThatThrownBy(
					() -> buildKiteService.fetchPipelineBuilds(mockToken, mockDeployment, mockStartTime, mockEndTime))
			.isInstanceOf(UnauthorizedException.class)
			.hasMessageContaining("unauthorized");
	}

	@Test
	public void shouldThrowInternalServerErrorExceptionWhenFetchPipelineBuilds500Exception() {
		String mockToken = "xxxxxxxxxx";
		DeploymentEnvironment mockDeployment = DeploymentEnvironmentBuilder.withDefault().build();
		List<String> linkHeader = new ArrayList<>();
		linkHeader.add(NONE_TOTAL_PAGE_HEADER);
		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.addAll(HttpHeaders.LINK, linkHeader);
		ResponseEntity<List<BuildKiteBuildInfo>> responseEntity = new ResponseEntity<>(null, httpHeaders,
				HttpStatus.OK);

		when(buildKiteFeignClient.getPipelineSteps(anyString(), anyString(), anyString(), anyString(), anyString(),
				anyString(), anyString(), any()))
			.thenReturn(responseEntity);

		assertThatThrownBy(() -> buildKiteService.fetchPipelineBuilds(mockToken, mockDeployment, null, mockEndTime))
			.isInstanceOf(InternalServerErrorException.class)
			.hasMessageContaining("Failed to get pipeline builds_param");
	}

	@Test
	public void shouldReturnDeployTimesWhenCountDeployTimes() {
		DeploymentEnvironment mockDeployment = DeploymentEnvironmentBuilder.withDefault().build();
		List<BuildKiteBuildInfo> mockBuildKiteBuildInfos = List.of(BuildKiteBuildInfoBuilder.withDefault().build(),
				BuildKiteBuildInfoBuilder.withDefault()
					.withJobs(List.of(BuildKiteJobBuilder.withDefault().withState(PASSED_STATE).build()))
					.build(),
				BuildKiteBuildInfoBuilder.withDefault()
					.withJobs(List.of(BuildKiteJobBuilder.withDefault().withStartedAt("").build()))
					.build());
		DeployTimes expectedDeployTimes = DeployTimesBuilder.withDefault().build();

		DeployTimes deployTimes = buildKiteService.countDeployTimes(mockDeployment, mockBuildKiteBuildInfos,
				mockStartTime, mockEndTime);

		assertThat(expectedDeployTimes).isEqualTo(deployTimes);
	}

	@Test
	public void shouldReturnDeployInfoWhenMappedDeployInfoIsNull() {
		DeploymentEnvironment mockDeployment = DeploymentEnvironmentBuilder.withDefault().withStep("xxxx").build();
		List<BuildKiteBuildInfo> mockBuildKiteBuildInfos = List.of(BuildKiteBuildInfoBuilder.withDefault().build());

		DeployTimes deployTimes = buildKiteService.countDeployTimes(mockDeployment, mockBuildKiteBuildInfos,
				mockStartTime, mockEndTime);

		assertThat(0).isEqualTo(deployTimes.getPassed().size());
		assertThat(1).isEqualTo(deployTimes.getFailed().size());
	}

	@Test
	public void shouldThrowErrorWhenCountDeployTimesGivenOrgIdIsNull() {
		DeploymentEnvironment mockDeployment = DeploymentEnvironment.builder().build();
		List<BuildKiteBuildInfo> mockBuildKiteBuildInfos = List.of(BuildKiteBuildInfo.builder().build());

		Assertions
			.assertThatThrownBy(() -> buildKiteService.countDeployTimes(mockDeployment, mockBuildKiteBuildInfos,
					mockStartTime, mockEndTime))
			.isInstanceOf(NotFoundException.class)
			.hasMessageContaining("miss orgId argument");
	}

	@Test
	public void shouldReturnDeployTimesWhenCountDeployTimesAtFixedTimeIntervals() {
		DeploymentEnvironment mockDeployment = DeploymentEnvironmentBuilder.withDefault().build();
		List<BuildKiteBuildInfo> mockBuildKiteBuildInfos = List.of(BuildKiteBuildInfoBuilder.withDefault().build(),
				BuildKiteBuildInfoBuilder.withDefault()
					.withJobs(List.of(
							BuildKiteJobBuilder.withDefault()
								.withState(PASSED_STATE)
								.withFinishedAt("2023-09-09T04:57:09.545Z")
								.build(),
							BuildKiteJobBuilder.withDefault()
								.withState(PASSED_STATE)
								.withFinishedAt("2022-08-28T04:57:09.545Z")
								.build(),
							BuildKiteJobBuilder.withDefault()
								.withState(FAILED_STATE)
								.withFinishedAt("2022-07-21T04:57:09.545Z")
								.build(),
							BuildKiteJobBuilder.withDefault()
								.withState(FAILED_STATE)
								.withFinishedAt("2022-08-30T04:57:09.545Z")
								.build()))
					.build(),
				BuildKiteBuildInfoBuilder.withDefault()
					.withJobs(List.of(BuildKiteJobBuilder.withDefault().withStartedAt("").build()))
					.build());
		DeployTimes expectedDeployTimes = DeployTimesBuilder.withDefault()
			.withPassed(Collections.emptyList())
			.withFailed(List.of(DeployInfoBuilder.withDefault().withState(FAILED_STATE).build(),
					DeployInfoBuilder.withDefault()
						.withState(FAILED_STATE)
						.withJobFinishTime("2022-08-30T04:57:09.545Z")
						.build()))
			.build();

		DeployTimes deployTimes = buildKiteService.countDeployTimes(mockDeployment, mockBuildKiteBuildInfos,
				mockStartTime, mockEndTime);

		assertThat(expectedDeployTimes).isEqualTo(deployTimes);
	}

	@Test
	void shouldReturnStepBeforeEndStepsGivenStepsArray() {
		String targetStep = "Deploy qa";
		List<String> stepArray = Arrays.asList("Test", "Build", targetStep, "Deploy prod");

		List<String> result = buildKiteService.getStepsBeforeEndStep(targetStep, stepArray);

		assertEquals(3, result.size());
		assertEquals("Test", result.get(0));
		assertEquals("Build", result.get(1));
		assertEquals(targetStep, result.get(2));
	}

}
