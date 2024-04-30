package heartbeat.service.report;

import heartbeat.client.dto.codebase.github.LeadTime;
import heartbeat.client.dto.codebase.github.PipelineLeadTime;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteBuildInfo;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteJob;
import heartbeat.client.dto.pipeline.buildkite.DeployInfo;
import heartbeat.client.dto.pipeline.buildkite.DeployTimes;
import heartbeat.controller.pipeline.dto.request.DeploymentEnvironment;
import heartbeat.controller.report.dto.request.BuildKiteSetting;
import heartbeat.controller.report.dto.request.CodebaseSetting;
import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.response.PipelineCSVInfo;
import heartbeat.service.pipeline.buildkite.BuildKiteService;
import heartbeat.service.report.calculator.model.FetchedData;
import heartbeat.service.source.github.GitHubService;
import org.assertj.core.util.Lists;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class PipelineServiceTest {

	@InjectMocks
	private PipelineService pipelineService;

	@Mock
	private BuildKiteService buildKiteService;

	@Mock
	private GitHubService gitHubService;

	@Captor
	ArgumentCaptor<Map<String, String>> roadMapArgumentCaptor;

	private final String MOCK_TOKEN = "mock-token";

	private final String MOCK_START_TIME = "1661702400000";

	private final String MOCK_END_TIME = "1662739199000";

	@Nested
	class FetchGithubData {

		@Test
		void shouldReturnEmptyBuildInfosListAndEmptyLeadTimeWhenDeploymentEnvironmentsIsEmpty() {
			GenerateReportRequest request = GenerateReportRequest.builder()
				.buildKiteSetting(BuildKiteSetting.builder().deploymentEnvList(new ArrayList<>()).build())
				.metrics(new ArrayList<>())
				.codebaseSetting(CodebaseSetting.builder().token(MOCK_TOKEN).build())
				.build();
			FetchedData.BuildKiteData result = pipelineService.fetchGitHubData(request);

			assertEquals(0, result.getBuildInfosList().size());
			verify(buildKiteService, never()).countDeployTimes(any(), any(), any(), any());
			verify(gitHubService).fetchPipelinesLeadTime(List.of(), new HashMap<>(), MOCK_TOKEN);
		}

		@Test
		void shouldReturnEmptyPipelineLeadTimeWhenCodebaseSettingIsEmpty() {
			GenerateReportRequest request = GenerateReportRequest.builder()
				.buildKiteSetting(BuildKiteSetting.builder().deploymentEnvList(new ArrayList<>()).build())
				.metrics(new ArrayList<>())
				.build();
			FetchedData.BuildKiteData result = pipelineService.fetchGitHubData(request);

			assertEquals(0, result.getPipelineLeadTimes().size());
			verify(gitHubService, never()).fetchPipelinesLeadTime(any(), any(), any());
		}

		@Test
		void shouldGetPipelineLeadTimeFromGithubServiceAndBuildKiteServiceWhenCodebaseSettingIsNotEmpty() {
			List<BuildKiteBuildInfo> fakeBuildKiteBuildInfos = new ArrayList<>();
			GenerateReportRequest request = GenerateReportRequest.builder()
				.buildKiteSetting(BuildKiteSetting.builder()
					.deploymentEnvList(List.of(DeploymentEnvironment.builder().id("env1").repository("repo1").build(),
							DeploymentEnvironment.builder().id("env2").repository("repo2").build()))
					.build())
				.startTime(MOCK_START_TIME)
				.endTime(MOCK_END_TIME)
				.codebaseSetting(CodebaseSetting.builder().token(MOCK_TOKEN).build())
				.metrics(new ArrayList<>())
				.build();

			when(buildKiteService.fetchPipelineBuilds(eq(MOCK_TOKEN), any(), eq(MOCK_START_TIME), eq(MOCK_END_TIME)))
				.thenReturn(fakeBuildKiteBuildInfos);
			when(buildKiteService.countDeployTimes(any(), eq(fakeBuildKiteBuildInfos), eq(MOCK_START_TIME),
					eq(MOCK_END_TIME)))
				.thenReturn(DeployTimes.builder().build());
			when(gitHubService.fetchPipelinesLeadTime(any(), any(), eq(MOCK_TOKEN)))
				.thenReturn(List.of(PipelineLeadTime.builder().build()));

			FetchedData.BuildKiteData result = pipelineService.fetchGitHubData(request);

			assertEquals(1, result.getPipelineLeadTimes().size());
			assertEquals(2, result.getBuildInfosList().size());
			assertEquals(2, result.getDeployTimesList().size());
			verify(buildKiteService, times(2)).countDeployTimes(any(), any(), any(), any());
			verify(buildKiteService, times(2)).countDeployTimes(any(), any(), any(), any());
			verify(gitHubService, times(1)).fetchPipelinesLeadTime(any(), any(), eq(MOCK_TOKEN));
		}

		@Test
		void shouldGetSecondValueInRoadMapWhenDeployEnvironmentListHasTwoElementWithSameKey() {
			List<BuildKiteBuildInfo> fakeBuildKiteBuildInfos = new ArrayList<>();
			GenerateReportRequest request = GenerateReportRequest.builder()
				.buildKiteSetting(BuildKiteSetting.builder()
					.deploymentEnvList(List.of(DeploymentEnvironment.builder().id("env1").repository("repo1").build(),
							DeploymentEnvironment.builder().id("env1").repository("repo2").build()))
					.build())
				.startTime(MOCK_START_TIME)
				.endTime(MOCK_END_TIME)
				.codebaseSetting(CodebaseSetting.builder().token(MOCK_TOKEN).build())
				.metrics(new ArrayList<>())
				.build();

			when(buildKiteService.fetchPipelineBuilds(eq(MOCK_TOKEN), any(), eq(MOCK_START_TIME), eq(MOCK_END_TIME)))
				.thenReturn(fakeBuildKiteBuildInfos);
			when(buildKiteService.countDeployTimes(any(), eq(fakeBuildKiteBuildInfos), eq(MOCK_START_TIME),
					eq(MOCK_END_TIME)))
				.thenReturn(DeployTimes.builder().build());
			when(gitHubService.fetchPipelinesLeadTime(any(), any(), eq(MOCK_TOKEN)))
				.thenReturn(List.of(PipelineLeadTime.builder().build()));

			pipelineService.fetchGitHubData(request);

			verify(gitHubService).fetchPipelinesLeadTime(any(), roadMapArgumentCaptor.capture(), any());
			assertEquals("repo2", roadMapArgumentCaptor.getValue().get("env1"));

		}

		@Test
		void shouldFilterAuthorByInputCrews() {
			List<BuildKiteBuildInfo> fakeBuildKiteBuildInfos = List.of(
					BuildKiteBuildInfo.builder()
						.author(BuildKiteBuildInfo.Author.builder().name("test-author1").build())
						.build(),
					BuildKiteBuildInfo.builder()
						.author(BuildKiteBuildInfo.Author.builder().name("test-author2").build())
						.build());
			GenerateReportRequest request = GenerateReportRequest.builder()
				.buildKiteSetting(BuildKiteSetting.builder()
					.deploymentEnvList(List.of(DeploymentEnvironment.builder().id("env1").repository("repo1").build()))
					.pipelineCrews(List.of("test-author1"))
					.build())
				.startTime(MOCK_START_TIME)
				.endTime(MOCK_END_TIME)
				.codebaseSetting(CodebaseSetting.builder().token(MOCK_TOKEN).build())
				.metrics(new ArrayList<>())
				.build();

			when(buildKiteService.fetchPipelineBuilds(eq(MOCK_TOKEN), any(), eq(MOCK_START_TIME), eq(MOCK_END_TIME)))
				.thenReturn(fakeBuildKiteBuildInfos);
			when(buildKiteService.countDeployTimes(any(), eq(fakeBuildKiteBuildInfos), eq(MOCK_START_TIME),
					eq(MOCK_END_TIME)))
				.thenReturn(DeployTimes.builder().build());
			when(gitHubService.fetchPipelinesLeadTime(any(), any(), eq(MOCK_TOKEN)))
				.thenReturn(List.of(PipelineLeadTime.builder().build()));

			FetchedData.BuildKiteData result = pipelineService.fetchGitHubData(request);

			assertEquals(1, result.getPipelineLeadTimes().size());
			assertEquals(1, result.getBuildInfosList().size());
			assertEquals(0, result.getBuildInfosList().get(0).getValue().size());
			assertEquals(1, result.getDeployTimesList().size());
			verify(buildKiteService, times(1)).fetchPipelineBuilds(any(), any(), any(), any());
			verify(buildKiteService, times(1)).countDeployTimes(any(), any(), any(), any());
			verify(gitHubService, times(1)).fetchPipelinesLeadTime(any(), any(), eq(MOCK_TOKEN));
		}

	}

	@Nested
	class FetchBuildKiteInfo {

		@Test
		void shouldReturnEmptyWhenDeploymentEnvListIsEmpty() {
			GenerateReportRequest request = GenerateReportRequest.builder()
				.buildKiteSetting(BuildKiteSetting.builder().deploymentEnvList(new ArrayList<>()).build())
				.metrics(new ArrayList<>())
				.build();
			FetchedData.BuildKiteData result = pipelineService.fetchBuildKiteInfo(request);

			assertEquals(0, result.getDeployTimesList().size());
			assertEquals(0, result.getBuildInfosList().size());
			verify(buildKiteService, never()).fetchPipelineBuilds(any(), any(), any(), any());
			verify(buildKiteService, never()).countDeployTimes(any(), any(), any(), any());
		}

		@Test
		void shouldReturnValueWhenDeploymentEnvListIsNotEmpty() {
			List<BuildKiteBuildInfo> fakeBuildKiteBuildInfos = List.of(BuildKiteBuildInfo.builder()
				.creator(BuildKiteBuildInfo.Creator.builder().name("someone").build())
				.author(BuildKiteBuildInfo.Author.builder().name("someone").build())
				.build());
			GenerateReportRequest request = GenerateReportRequest.builder()
				.buildKiteSetting(BuildKiteSetting.builder()
					.token(MOCK_TOKEN)
					.pipelineCrews(List.of("someone"))
					.deploymentEnvList(List.of(DeploymentEnvironment.builder().id("env1").repository("repo1").build()))
					.build())
				.metrics(new ArrayList<>())
				.startTime(MOCK_START_TIME)
				.endTime(MOCK_END_TIME)
				.build();

			when(buildKiteService.fetchPipelineBuilds(eq(MOCK_TOKEN), any(), eq(MOCK_START_TIME), eq(MOCK_END_TIME)))
				.thenReturn(fakeBuildKiteBuildInfos);
			when(buildKiteService.countDeployTimes(any(), eq(fakeBuildKiteBuildInfos), eq(MOCK_START_TIME),
					eq(MOCK_END_TIME)))
				.thenReturn(DeployTimes.builder().build());

			FetchedData.BuildKiteData result = pipelineService.fetchBuildKiteInfo(request);

			assertEquals(result.getDeployTimesList().size(), 1);
			assertEquals(result.getBuildInfosList().size(), 1);
			assertEquals(1, result.getBuildInfosList().get(0).getValue().size());
			assertEquals("someone", result.getBuildInfosList().get(0).getValue().get(0).getAuthor().getName());
			verify(buildKiteService, times(1)).fetchPipelineBuilds(any(), any(), any(), any());
			verify(buildKiteService, times(1)).countDeployTimes(any(), any(), any(), any());
		}

		@Test
		void shouldFilterAuthorsByInputCrews() {
			List<BuildKiteBuildInfo> fakeBuildKiteBuildInfos = List.of(
					BuildKiteBuildInfo.builder()
						.creator(BuildKiteBuildInfo.Creator.builder().name("test-creator1").build())
						.author(BuildKiteBuildInfo.Author.builder().name("test-author1").build())
						.build(),
					BuildKiteBuildInfo.builder()
						.creator(BuildKiteBuildInfo.Creator.builder().name("test-creator2").build())
						.author(BuildKiteBuildInfo.Author.builder().name("test-author2").build())
						.build(),
					BuildKiteBuildInfo.builder().author(null).build());
			GenerateReportRequest request = GenerateReportRequest.builder()
				.buildKiteSetting(BuildKiteSetting.builder()
					.deploymentEnvList(List.of(DeploymentEnvironment.builder().id("env1").repository("repo1").build()))
					.pipelineCrews(List.of("test-author2", "test-author3", "Unknown"))
					.build())
				.startTime(MOCK_START_TIME)
				.endTime(MOCK_END_TIME)
				.codebaseSetting(CodebaseSetting.builder().token(MOCK_TOKEN).build())
				.metrics(new ArrayList<>())
				.build();

			when(buildKiteService.fetchPipelineBuilds(any(), any(), any(), any())).thenReturn(fakeBuildKiteBuildInfos);
			when(buildKiteService.countDeployTimes(any(), eq(fakeBuildKiteBuildInfos), eq(MOCK_START_TIME),
					eq(MOCK_END_TIME)))
				.thenReturn(DeployTimes.builder().build());

			FetchedData.BuildKiteData result = pipelineService.fetchBuildKiteInfo(request);

			assertEquals(1, result.getBuildInfosList().size());
			assertEquals(2, result.getBuildInfosList().get(0).getValue().size());
			assertEquals(1, result.getDeployTimesList().size());
			verify(buildKiteService, times(1)).fetchPipelineBuilds(any(), any(), any(), any());
			verify(buildKiteService, times(1)).countDeployTimes(any(), any(), any(), any());
		}

	}

	@Nested
	class GenerateCSVForPipelineWithCodebase {

		@Test
		void shouldReturnEmptyWhenDeploymentEnvironmentsIsEmpty() {
			List<PipelineCSVInfo> result = pipelineService.generateCSVForPipeline(MOCK_START_TIME, MOCK_END_TIME,
					FetchedData.BuildKiteData.builder().build(), Lists.list());

			assertEquals(0, result.size());
			verify(buildKiteService, never()).getPipelineStepNames(any());
		}

		@Test
		void shouldReturnEmptyWhenNoBuildInfoFoundForDeploymentEnvironment() {
			List<PipelineCSVInfo> result = pipelineService.generateCSVForPipeline(MOCK_START_TIME, MOCK_END_TIME,
					FetchedData.BuildKiteData.builder().buildInfosList(List.of(Map.entry("env1", List.of()))).build(),
					List.of(DeploymentEnvironment.builder().id("env1").build()));

			assertEquals(0, result.size());
			verify(buildKiteService, never()).getPipelineStepNames(any());
		}

		@Test
		void shouldReturnEmptyWhenPipelineStepsIsEmpty() {
			List<BuildKiteBuildInfo> kiteBuildInfos = List.of(BuildKiteBuildInfo.builder().build());
			when(buildKiteService.getPipelineStepNames(eq(kiteBuildInfos))).thenReturn(List.of());

			List<PipelineCSVInfo> result = pipelineService.generateCSVForPipeline(MOCK_START_TIME, MOCK_END_TIME,
					FetchedData.BuildKiteData.builder()
						.buildInfosList(List.of(Map.entry("env1", kiteBuildInfos)))
						.build(),
					List.of(DeploymentEnvironment.builder().id("env1").build()));

			assertEquals(0, result.size());
			verify(buildKiteService, times(1)).getPipelineStepNames(any());
		}

		@Test
		void shouldReturnEmptyWhenBuildJobIsEmpty() {
			List<BuildKiteBuildInfo> kiteBuildInfos = List.of(BuildKiteBuildInfo.builder().build());
			when(buildKiteService.getPipelineStepNames(eq(kiteBuildInfos))).thenReturn(List.of("check"));
			when(buildKiteService.getBuildKiteJob(any(), any(), any(), eq(MOCK_START_TIME), eq(MOCK_END_TIME)))
				.thenReturn(null);
			when(buildKiteService.getStepsBeforeEndStep(any(), any())).thenReturn(List.of("check"));
			List<PipelineCSVInfo> result = pipelineService.generateCSVForPipeline(MOCK_START_TIME, MOCK_END_TIME,
					FetchedData.BuildKiteData.builder()
						.buildInfosList(List.of(Map.entry("env1", kiteBuildInfos)))
						.build(),
					List.of(DeploymentEnvironment.builder().id("env1").build()));

			assertEquals(0, result.size());
			verify(buildKiteService, times(1)).getPipelineStepNames(any());
			verify(buildKiteService, times(1)).getBuildKiteJob(any(), any(), any(), eq(MOCK_START_TIME),
					eq(MOCK_END_TIME));
		}

		@Test
		void shouldFilterOutInvalidBuildOfCommentIsEmtpy() {
			List<BuildKiteBuildInfo> kiteBuildInfos = List.of(BuildKiteBuildInfo.builder().commit("").build());
			when(buildKiteService.getPipelineStepNames(eq(kiteBuildInfos))).thenReturn(List.of("check"));
			when(buildKiteService.getStepsBeforeEndStep(any(), any())).thenReturn(List.of("check"));
			when(buildKiteService.getBuildKiteJob(any(), any(), any(), eq(MOCK_START_TIME), eq(MOCK_END_TIME)))
				.thenReturn(BuildKiteJob.builder().build());

			List<PipelineCSVInfo> result = pipelineService.generateCSVForPipeline(MOCK_START_TIME, MOCK_END_TIME,
					FetchedData.BuildKiteData.builder()
						.buildInfosList(List.of(Map.entry("env1", kiteBuildInfos)))
						.build(),
					List.of(DeploymentEnvironment.builder().id("env1").build()));

			assertEquals(0, result.size());
			verify(buildKiteService, times(1)).getPipelineStepNames(any());
			verify(buildKiteService, times(1)).getBuildKiteJob(any(), any(), any(), any(), any());
		}

		@Test
		void shouldGenerateValueHasCommit() {
			List<BuildKiteBuildInfo> kiteBuildInfos = List.of(BuildKiteBuildInfo.builder()
				.commit("commit")
				.author(BuildKiteBuildInfo.Author.builder().name("xxxx").build())
				.build());
			when(buildKiteService.getPipelineStepNames(eq(kiteBuildInfos))).thenReturn(List.of("check"));
			when(buildKiteService.getStepsBeforeEndStep(any(), any())).thenReturn(List.of("check"));
			when(buildKiteService.getBuildKiteJob(any(), any(), any(), eq(MOCK_START_TIME), eq(MOCK_END_TIME)))
				.thenReturn(BuildKiteJob.builder().build());
			DeployInfo fakeDeploy = DeployInfo.builder().commitId("commitId").jobName("test").build();
			when(buildKiteService.mapToDeployInfo(any(), any(), any(), any(), any())).thenReturn(fakeDeploy);

			List<PipelineCSVInfo> result = pipelineService.generateCSVForPipeline(MOCK_START_TIME, MOCK_END_TIME,
					FetchedData.BuildKiteData.builder()
						.buildInfosList(List.of(Map.entry("env1", kiteBuildInfos)))
						.build(),
					List.of(DeploymentEnvironment.builder().id("env1").name("env-name").build()));

			assertEquals(1, result.size());
			PipelineCSVInfo pipelineCSVInfo = result.get(0);
			assertEquals("env-name", pipelineCSVInfo.getPipeLineName());
			assertEquals("xxxx", pipelineCSVInfo.getBuildInfo().getAuthor().getName());
			assertEquals(fakeDeploy, pipelineCSVInfo.getDeployInfo());
			verify(buildKiteService, times(1)).getPipelineStepNames(any());
			verify(buildKiteService, times(1)).getBuildKiteJob(any(), any(), any(), any(), any());
		}

		@Test
		void shouldGenerateValueWithLeadTimeWhenLeadTimeExisting() {
			List<BuildKiteBuildInfo> kiteBuildInfos = List.of(BuildKiteBuildInfo.builder()
				.commit("commit")
				.author(BuildKiteBuildInfo.Author.builder().name("xxxx").build())
				.build());
			when(buildKiteService.getPipelineStepNames(eq(kiteBuildInfos))).thenReturn(List.of("check"));
			when(buildKiteService.getStepsBeforeEndStep(any(), any())).thenReturn(List.of("check"));
			when(buildKiteService.getBuildKiteJob(any(), any(), any(), eq(MOCK_START_TIME), eq(MOCK_END_TIME)))
				.thenReturn(BuildKiteJob.builder().build());
			DeployInfo fakeDeploy = DeployInfo.builder().commitId("commitId").jobName("test").build();
			when(buildKiteService.mapToDeployInfo(any(), any(), any(), any(), any())).thenReturn(fakeDeploy);

			List<PipelineCSVInfo> result = pipelineService.generateCSVForPipeline(MOCK_START_TIME, MOCK_END_TIME,
					FetchedData.BuildKiteData.builder()
						.pipelineLeadTimes(List.of(PipelineLeadTime.builder()
							.leadTimes(List.of(LeadTime.builder().commitId("commitId").build()))
							.pipelineName("env-name")
							.build()))
						.buildInfosList(List.of(Map.entry("env1", kiteBuildInfos)))
						.build(),
					List.of(DeploymentEnvironment.builder().id("env1").name("env-name").build()));

			assertEquals(1, result.size());
			PipelineCSVInfo pipelineCSVInfo = result.get(0);
			assertEquals("env-name", pipelineCSVInfo.getPipeLineName());
			assertEquals("xxxx", pipelineCSVInfo.getBuildInfo().getAuthor().getName());
			assertEquals(fakeDeploy, pipelineCSVInfo.getDeployInfo());
			verify(buildKiteService, times(1)).getPipelineStepNames(any());
			verify(buildKiteService, times(1)).getBuildKiteJob(any(), any(), any(), any(), any());
		}

		@Test
		void shouldGenerateValueWithOrganizationWhenDeployHasOrganization() {
			List<BuildKiteBuildInfo> kiteBuildInfos = List.of(BuildKiteBuildInfo.builder()
				.commit("commit")
				.author(BuildKiteBuildInfo.Author.builder().name("xxxx").build())
				.build());
			when(buildKiteService.getPipelineStepNames(eq(kiteBuildInfos))).thenReturn(List.of("check"));
			when(buildKiteService.getStepsBeforeEndStep(any(), any())).thenReturn(List.of("check"));
			when(buildKiteService.getBuildKiteJob(any(), any(), any(), eq(MOCK_START_TIME), eq(MOCK_END_TIME)))
				.thenReturn(BuildKiteJob.builder().build());
			DeployInfo fakeDeploy = DeployInfo.builder().commitId("commitId").jobName("test").build();
			when(buildKiteService.mapToDeployInfo(any(), any(), any(), any(), any())).thenReturn(fakeDeploy);

			List<PipelineCSVInfo> result = pipelineService.generateCSVForPipeline(MOCK_START_TIME, MOCK_END_TIME,
					FetchedData.BuildKiteData.builder()
						.pipelineLeadTimes(List.of(PipelineLeadTime.builder()
							.leadTimes(List.of(LeadTime.builder().commitId("commitId").build()))
							.pipelineName("env-name")
							.build()))
						.buildInfosList(List.of(Map.entry("env1", kiteBuildInfos)))
						.build(),
					List.of(DeploymentEnvironment.builder()
						.id("env1")
						.name("env-name")
						.orgName("Thoughtworks-Heartbeat")
						.build()));

			assertEquals(1, result.size());
			PipelineCSVInfo pipelineCSVInfo = result.get(0);
			assertEquals("Thoughtworks-Heartbeat", pipelineCSVInfo.getOrganizationName());
			assertEquals("xxxx", pipelineCSVInfo.getBuildInfo().getAuthor().getName());
			assertEquals(fakeDeploy, pipelineCSVInfo.getDeployInfo());
			verify(buildKiteService, times(1)).getPipelineStepNames(any());
			verify(buildKiteService, times(1)).getBuildKiteJob(any(), any(), any(), any(), any());
		}

		@Test
		void shouldGenerateValueWhenBuildKiteDataAuthorIsNotNull() {
			List<BuildKiteBuildInfo> kiteBuildInfos = List.of(BuildKiteBuildInfo.builder()
				.commit("commit")
				.author(BuildKiteBuildInfo.Author.builder().name("xxxx").build())
				.build());
			when(buildKiteService.getPipelineStepNames(kiteBuildInfos)).thenReturn(List.of("check"));
			when(buildKiteService.getStepsBeforeEndStep(any(), any())).thenReturn(List.of("check"));
			when(buildKiteService.getBuildKiteJob(any(), any(), any(), eq(MOCK_START_TIME), eq(MOCK_END_TIME)))
				.thenReturn(BuildKiteJob.builder().build());
			DeployInfo fakeDeploy = DeployInfo.builder().commitId("commitId").jobName("test").build();
			when(buildKiteService.mapToDeployInfo(any(), any(), any(), any(), any())).thenReturn(fakeDeploy);

			List<PipelineCSVInfo> result = pipelineService.generateCSVForPipeline(MOCK_START_TIME, MOCK_END_TIME,
					FetchedData.BuildKiteData.builder()
						.pipelineLeadTimes(List.of(PipelineLeadTime.builder()
							.leadTimes(List.of(LeadTime.builder().commitId("commitId").build()))
							.pipelineName("env-name")
							.build()))
						.buildInfosList(List.of(Map.entry("env1", kiteBuildInfos)))
						.build(),
					List.of(DeploymentEnvironment.builder()
						.id("env1")
						.name("env-name")
						.orgName("Thoughtworks-Heartbeat")
						.build()));

			assertEquals(1, result.size());
			PipelineCSVInfo pipelineCSVInfo = result.get(0);
			assertEquals("Thoughtworks-Heartbeat", pipelineCSVInfo.getOrganizationName());
			assertEquals("xxxx", pipelineCSVInfo.getBuildInfo().getAuthor().getName());
			assertEquals(fakeDeploy, pipelineCSVInfo.getDeployInfo());
			verify(buildKiteService, times(1)).getPipelineStepNames(any());
			verify(buildKiteService, times(1)).getBuildKiteJob(any(), any(), any(), any(), any());
		}

	}

}
