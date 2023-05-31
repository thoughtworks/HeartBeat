package heartbeat.service.report;

import heartbeat.client.dto.board.jira.Assignee;
import heartbeat.client.dto.board.jira.JiraCard;
import heartbeat.client.dto.board.jira.JiraCardField;
import heartbeat.client.dto.codebase.github.LeadTime;
import heartbeat.client.dto.codebase.github.PipelineLeadTime;
import heartbeat.controller.board.dto.request.RequestJiraBoardColumnSetting;
import heartbeat.controller.board.dto.response.CardCollection;
import heartbeat.controller.board.dto.response.JiraCardDTO;
import heartbeat.controller.board.dto.response.TargetField;
import heartbeat.controller.pipeline.dto.request.DeploymentEnvironment;
import heartbeat.controller.report.dto.request.BuildKiteSetting;
import heartbeat.controller.report.dto.request.CodebaseSetting;
import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.request.JiraBoardSetting;
import heartbeat.controller.report.dto.response.AvgChangeFailureRate;
import heartbeat.controller.report.dto.response.AvgDeploymentFrequency;
import heartbeat.controller.report.dto.response.AvgLeadTimeForChanges;
import heartbeat.controller.report.dto.response.ChangeFailureRate;
import heartbeat.controller.report.dto.response.Classification;
import heartbeat.controller.report.dto.response.ClassificationNameValuePair;
import heartbeat.controller.report.dto.response.CycleTime;
import heartbeat.controller.report.dto.response.DeploymentFrequency;
import heartbeat.controller.report.dto.response.LeadTimeForChanges;
import heartbeat.controller.report.dto.response.LeadTimeForChangesOfPipelines;
import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.controller.report.dto.response.Velocity;
import heartbeat.service.board.jira.JiraService;
import heartbeat.service.pipeline.buildkite.BuildKiteService;
import heartbeat.service.pipeline.buildkite.builder.BuildKiteBuildInfoBuilder;
import heartbeat.service.pipeline.buildkite.builder.BuildKiteJobBuilder;
import heartbeat.service.pipeline.buildkite.builder.DeployInfoBuilder;
import heartbeat.service.pipeline.buildkite.builder.DeployTimesBuilder;
import heartbeat.service.pipeline.buildkite.builder.DeploymentEnvironmentBuilder;
import heartbeat.service.report.calculator.ChangeFailureRateCalculator;
import heartbeat.service.report.calculator.ClassificationCalculator;
import heartbeat.service.report.calculator.CycleTimeCalculator;
import heartbeat.service.report.calculator.DeploymentFrequencyCalculator;
import heartbeat.service.report.calculator.VelocityCalculator;
import heartbeat.service.source.github.GitHubService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.List;
import java.util.concurrent.CompletableFuture;

import static heartbeat.service.report.CycleTimeFixture.JIRA_BOARD_COLUMNS_SETTING;
import static heartbeat.service.report.CycleTimeFixture.MOCK_CARD_COLLECTION;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

import static heartbeat.TestFixtures.BUILDKITE_TOKEN;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class GenerateReporterServiceTest {

	@InjectMocks
	GenerateReporterService generateReporterService;

	@Mock
	JiraService jiraService;

	@Mock
	WorkDay workDay;

	@Mock
	ClassificationCalculator classificationCalculator;

	@Mock
	private BuildKiteService buildKiteService;

	@Mock
	private GitHubService gitHubService;

	@Mock
	private DeploymentFrequencyCalculator calculateDeploymentFrequency;

	@Mock
	private ChangeFailureRateCalculator calculateChangeFailureRate;

	@Mock
	private CycleTimeCalculator cycleTimeCalculator;

	@Mock
	VelocityCalculator velocityCalculator;

	@Mock
	private LeadTimeForChangesCalculator leadTimeForChangesCalculator;

	@Test
	void shouldReturnGenerateReportResponseWhenCallGenerateReporter() {
		JiraBoardSetting jiraBoardSetting = JiraBoardSetting.builder()
			.boardId("")
			.boardColumns(List.of())
			.token("testToken")
			.site("site")
			.doneColumn(List.of())
			.treatFlagCardAsBlock(true)
			.type("jira")
			.projectKey("PLL")
			.build();
		GenerateReportRequest request = GenerateReportRequest.builder()
			.considerHoliday(false)
			.metrics(List.of("velocity"))
			.jiraBoardSetting(jiraBoardSetting)
			.startTime("123")
			.endTime("123")
			.jiraBoardSetting(JiraBoardSetting.builder().treatFlagCardAsBlock(true).build())
			.build();

		Velocity velocity = Velocity.builder().velocityForSP(0).velocityForCards(0).build();
		when(jiraService.getStoryPointsAndCycleTime(any(), any(), any()))
			.thenReturn(CardCollection.builder().storyPointSum(0).cardsNumber(0).build());
		when(velocityCalculator.calculateVelocity(any())).thenReturn(velocity);

		ReportResponse result = generateReporterService.generateReporter(request);

		assertThat(result).isEqualTo(ReportResponse.builder().velocity(velocity).build());
	}

	@Test
	public void testGenerateReportWithClassification() {
		JiraBoardSetting jiraBoardSetting = JiraBoardSetting.builder()
			.boardId("")
			.boardColumns(List.of())
			.token("testToken")
			.site("site")
			.doneColumn(List.of())
			.treatFlagCardAsBlock(true)
			.type("jira")
			.projectKey("PLL")
			.targetFields(List.of(TargetField.builder().key("assignee").name("Assignee").flag(true).build()))
			.build();
		GenerateReportRequest request = GenerateReportRequest.builder()
			.considerHoliday(false)
			.metrics(List.of("classification"))
			.jiraBoardSetting(jiraBoardSetting)
			.startTime("123")
			.endTime("123")
			.jiraBoardSetting(JiraBoardSetting.builder().treatFlagCardAsBlock(true).build())
			.build();

		Classification classification = Classification.builder()
			.fieldName("Assignee")
			.pairList((List.of(ClassificationNameValuePair.builder().name("shawn").value(1.0D).build())))
			.build();

		when(jiraService.getStoryPointsAndCycleTime(any(), any(), any())).thenReturn(CardCollection.builder()
			.storyPointSum(0)
			.cardsNumber(0)
			.jiraCardDTOList(List.of(JiraCardDTO.builder()
				.baseInfo(JiraCard.builder()
					.fields(JiraCardField.builder().assignee(Assignee.builder().displayName("shawn").build()).build())
					.build())
				.build()))
			.build());
		Classification mockClassification = Classification.builder()
			.fieldName("Assignee")
			.pairList((List.of(ClassificationNameValuePair.builder().name("shawn").value(1.0D).build())))
			.build();

		when(classificationCalculator.calculate(any(), any())).thenReturn(List.of(mockClassification));

		ReportResponse result = generateReporterService.generateReporter(request);

		assertThat(result.getClassificationList()).isEqualTo(List.of(classification));
	}

	@Test
	public void testGenerateReporterWithDeploymentFrequencyMetric() {
		DeploymentEnvironment mockDeployment = DeploymentEnvironmentBuilder.withDefault().build();

		BuildKiteSetting buildKiteSetting = BuildKiteSetting.builder()
			.type("BuildKite")
			.token(BUILDKITE_TOKEN)
			.deploymentEnvList(List.of(mockDeployment))
			.build();

		GenerateReportRequest request = GenerateReportRequest.builder()
			.considerHoliday(false)
			.metrics(List.of("deployment frequency"))
			.buildKiteSetting(buildKiteSetting)
			.startTime("1661702400000")
			.endTime("1662739199000")
			.build();

		DeploymentFrequency deploymentFrequency = DeploymentFrequency.builder()
			.avgDeploymentFrequency(new AvgDeploymentFrequency("Average", 0.10F))
			.build();

		when(buildKiteService.fetchPipelineBuilds(any(), any(), any(), any()))
			.thenReturn(List.of(BuildKiteBuildInfoBuilder.withDefault()
				.withJobs(List.of(BuildKiteJobBuilder.withDefault().build()))
				.build()));

		when(buildKiteService.countDeployTimes(any(), any(), any(), any())).thenReturn(
				DeployTimesBuilder.withDefault().withPassed(List.of(DeployInfoBuilder.withDefault().build())).build());

		DeploymentFrequency mockedDeploymentFrequency = DeploymentFrequency.builder()
			.avgDeploymentFrequency(new AvgDeploymentFrequency("Average", 0.10F))
			.build();

		when(calculateDeploymentFrequency.calculate(any(), anyLong(), anyLong())).thenReturn(mockedDeploymentFrequency);

		ReportResponse response = generateReporterService.generateReporter(request);

		assertThat(response.getDeploymentFrequency().getAvgDeploymentFrequency())
			.isEqualTo(deploymentFrequency.getAvgDeploymentFrequency());
	}

	@Test
	public void testGenerateReporterWithChangeFailureRateMetric() {
		DeploymentEnvironment mockDeployment = DeploymentEnvironmentBuilder.withDefault().build();

		BuildKiteSetting buildKiteSetting = BuildKiteSetting.builder()
			.type("BuildKite")
			.token(BUILDKITE_TOKEN)
			.deploymentEnvList(List.of(mockDeployment))
			.build();
		GenerateReportRequest request = GenerateReportRequest.builder()
			.considerHoliday(false)
			.metrics(List.of("change failure rate"))
			.buildKiteSetting(buildKiteSetting)
			.startTime("1661702400000")
			.endTime("1662739199000")
			.build();

		ChangeFailureRate changeFailureRate = ChangeFailureRate.builder()
			.avgChangeFailureRate(AvgChangeFailureRate.builder().failureRate(0.1F).build())
			.build();

		when(buildKiteService.fetchPipelineBuilds(any(), any(), any(), any()))
			.thenReturn(List.of(BuildKiteBuildInfoBuilder.withDefault()
				.withJobs(List.of(BuildKiteJobBuilder.withDefault().build()))
				.build()));

		when(buildKiteService.countDeployTimes(any(), any(), any(), any())).thenReturn(
				DeployTimesBuilder.withDefault().withPassed(List.of(DeployInfoBuilder.withDefault().build())).build());

		ChangeFailureRate mockedChangeFailureRate = ChangeFailureRate.builder()
			.avgChangeFailureRate(AvgChangeFailureRate.builder().failureRate(0.1F).build())
			.build();

		when(calculateChangeFailureRate.calculate(any())).thenReturn(mockedChangeFailureRate);

		ReportResponse response = generateReporterService.generateReporter(request);

		assertThat(response.getChangeFailureRate().getAvgChangeFailureRate().getFailureRate())
			.isEqualTo(changeFailureRate.getAvgChangeFailureRate().getFailureRate());
	}

	@Test
	void shouldReturnGenerateReportResponseWithCycleTimeModelWhenCallGenerateReporterWithCycleTimeMetrics() {
		CardCollection cardCollection = MOCK_CARD_COLLECTION();
		List<RequestJiraBoardColumnSetting> boardColumns = JIRA_BOARD_COLUMNS_SETTING();

		JiraBoardSetting jiraBoardSetting = JiraBoardSetting.builder()
			.boardId("")
			.boardColumns(boardColumns)
			.token("testToken")
			.site("site")
			.doneColumn(List.of())
			.treatFlagCardAsBlock(true)
			.type("jira")
			.projectKey("PLL")
			.build();
		GenerateReportRequest request = GenerateReportRequest.builder()
			.considerHoliday(false)
			.metrics(List.of("cycle time"))
			.jiraBoardSetting(jiraBoardSetting)
			.startTime("123")
			.endTime("123")
			.jiraBoardSetting(JiraBoardSetting.builder().treatFlagCardAsBlock(true).build())
			.build();

		when(jiraService.getStoryPointsAndCycleTime(any(), any(), any())).thenReturn(cardCollection);
		when(cycleTimeCalculator.calculateCycleTime(cardCollection, request.getJiraBoardSetting().getBoardColumns()))
			.thenReturn(CycleTime.builder().build());

		ReportResponse result = generateReporterService.generateReporter(request);

		assertThat(result).isEqualTo(ReportResponse.builder().cycleTime(CycleTime.builder().build()).build());

	}

	@Test
	public void testGenerateReporterWithLeadTimeForChangesMetric() {
		DeploymentEnvironment mockDeployment = DeploymentEnvironmentBuilder.withDefault().build();
		mockDeployment.setRepository("https://github.com/XXXX-fs/fs-platform-onboarding");

		CodebaseSetting codebaseSetting = CodebaseSetting.builder()
			.type("Github")
			.token("github_fake_token")
			.leadTime(List.of(mockDeployment))
			.build();

		BuildKiteSetting buildKiteSetting = BuildKiteSetting.builder()
			.type("BuildKite")
			.token("buildKite_fake_token")
			.deploymentEnvList(List.of(mockDeployment))
			.build();

		GenerateReportRequest request = GenerateReportRequest.builder()
			.considerHoliday(true)
			.metrics(List.of("lead time for changes"))
			.buildKiteSetting(buildKiteSetting)
			.codebaseSetting(codebaseSetting)
			.startTime("1661702400000")
			.endTime("1662739199000")
			.build();

		PipelineLeadTime pipelineLeadTime = PipelineLeadTime.builder()
			.pipelineStep("Step")
			.pipelineName("Name")
			.leadTimes(List.of(LeadTime.builder()
				.commitId("111")
				.prCreatedTime(1.6585491E12)
				.prMergedTime(1.65854916E12)
				.firstCommitTimeInPr(1.6585491E12)
				.jobFinishTime(1.65854916E12)
				.pipelineCreateTime(1.6585491E12)
				.prDelayTime(60000)
				.pipelineDelayTime(60000)
				.totalTime(120000)
				.build()))
			.build();

		LeadTimeForChanges mockLeadTimeForChanges = LeadTimeForChanges.builder()
			.leadTimeForChangesOfPipelines(List.of(LeadTimeForChangesOfPipelines.builder()
				.name("Name")
				.step("Step")
				.mergeDelayTime(1.0)
				.pipelineDelayTime(1.0)
				.totalDelayTime(2.0)
				.build()))
			.avgLeadTimeForChanges(AvgLeadTimeForChanges.builder()
				.name("Average")
				.mergeDelayTime(1.0)
				.pipelineDelayTime(1.0)
				.totalDelayTime(2.0)
				.build())
			.build();

		when(buildKiteService.fetchPipelineBuilds(any(), any(), any(), any()))
			.thenReturn(List.of(BuildKiteBuildInfoBuilder.withDefault()
				.withJobs(List.of(BuildKiteJobBuilder.withDefault().build()))
				.build()));
		when(buildKiteService.countDeployTimes(any(), any(), any(), any())).thenReturn(
				DeployTimesBuilder.withDefault().withPassed(List.of(DeployInfoBuilder.withDefault().build())).build());
		when(gitHubService.fetchPipelinesLeadTime(any(), any(), any())).thenReturn(List.of(pipelineLeadTime));
		when(leadTimeForChangesCalculator.calculate(any())).thenReturn(mockLeadTimeForChanges);
		ReportResponse result = generateReporterService.generateReporter(request);

		assertThat(result.getLeadTimeForChanges()).isEqualTo(mockLeadTimeForChanges);
	}

}
