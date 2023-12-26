package heartbeat.service.report;

import heartbeat.client.component.JiraUriGenerator;
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
import heartbeat.controller.report.dto.request.ExportCSVRequest;
import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.request.JiraBoardSetting;
import heartbeat.controller.report.dto.request.RequireDataEnum;
import heartbeat.controller.report.dto.response.AvgChangeFailureRate;
import heartbeat.controller.report.dto.response.AvgDeploymentFrequency;
import heartbeat.controller.report.dto.response.AvgLeadTimeForChanges;
import heartbeat.controller.report.dto.response.AvgMeanTimeToRecovery;
import heartbeat.controller.report.dto.response.ChangeFailureRate;
import heartbeat.controller.report.dto.response.Classification;
import heartbeat.controller.report.dto.response.ClassificationNameValuePair;
import heartbeat.controller.report.dto.response.CycleTime;
import heartbeat.controller.report.dto.response.DeploymentFrequency;
import heartbeat.controller.report.dto.response.LeadTimeForChanges;
import heartbeat.controller.report.dto.response.LeadTimeForChangesOfPipelines;
import heartbeat.controller.report.dto.response.MeanTimeToRecovery;
import heartbeat.controller.report.dto.response.MeanTimeToRecoveryOfPipeline;
import heartbeat.controller.report.dto.response.MetricsDataReady;
import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.controller.report.dto.response.Velocity;
import heartbeat.exception.BadRequestException;
import heartbeat.exception.BaseException;
import heartbeat.exception.GenerateReportException;
import heartbeat.exception.NotFoundException;
import heartbeat.exception.PermissionDenyException;
import heartbeat.exception.RequestFailedException;
import heartbeat.exception.ServiceUnavailableException;
import heartbeat.exception.UnauthorizedException;
import heartbeat.handler.AsyncReportRequestHandler;
import heartbeat.service.board.jira.JiraColumnResult;
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
import heartbeat.service.report.calculator.MeanToRecoveryCalculator;
import heartbeat.service.report.calculator.VelocityCalculator;
import heartbeat.service.source.github.GitHubService;
import heartbeat.handler.AsyncExceptionHandler;
import lombok.val;
import org.junit.Before;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.core.io.InputStreamResource;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.stream.Collectors;

import static heartbeat.service.report.CycleTimeFixture.JIRA_BOARD_COLUMNS_SETTING;
import static heartbeat.service.report.CycleTimeFixture.MOCK_CARD_COLLECTION;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import static heartbeat.TestFixtures.BUILDKITE_TOKEN;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class GenerateReporterServiceTest {

	public static final String SITE_ATLASSIAN_NET = "https://site.atlassian.net";

	@InjectMocks
	GenerateReporterService generateReporterService;

	@Mock
	JiraService jiraService;

	@Mock
	WorkDay workDay;

	@Mock
	ClassificationCalculator classificationCalculator;

	@Mock
	CSVFileGenerator csvFileGenerator;

	@Mock
	VelocityCalculator velocityCalculator;

	Path mockPipelineCsvPath = Path.of("./csv/exportPipelineMetrics-1683734399999.csv");

	Path mockBoardCsvPath = Path.of("./csv/exportBoard-1683734399999.csv");

	Path mockMetricCsvPath = Path.of("./csv/exportMetric-1683734399999.csv");

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
	private LeadTimeForChangesCalculator leadTimeForChangesCalculator;

	@Mock
	private MeanToRecoveryCalculator meanToRecoveryCalculator;

	@Mock
	private JiraUriGenerator urlGenerator;

	@Mock
	private AsyncReportRequestHandler asyncReportRequestHandler;

	@Mock
	private AsyncExceptionHandler asyncExceptionHandler;

	@Captor
	private ArgumentCaptor<MetricsDataReady> metricsCaptor;

	@Captor
	private ArgumentCaptor<String> keyCaptor;


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
			.targetFields(Collections.emptyList())
			.build();
		GenerateReportRequest request = GenerateReportRequest.builder()
			.considerHoliday(false)
			.metrics(List.of("velocity"))
			.jiraBoardSetting(jiraBoardSetting)
			.startTime("123")
			.endTime("123")
			.csvTimeStamp("1683734399999")
			.build();

		URI mockUrl = URI.create(SITE_ATLASSIAN_NET);

		Velocity velocity = Velocity.builder().velocityForSP(0).velocityForCards(0).build();
		when(jiraService.getStoryPointsAndCycleTimeForDoneCards(any(), any(), any(), any()))
			.thenReturn(CardCollection.builder()
				.storyPointSum(0)
				.cardsNumber(0)
				.jiraCardDTOList(Collections.emptyList())
				.build());
		when(jiraService.getStoryPointsAndCycleTimeForNonDoneCards(any(), any(), any()))
			.thenReturn(CardCollection.builder()
				.storyPointSum(0)
				.cardsNumber(0)
				.jiraCardDTOList(Collections.emptyList())
				.build());
		when(jiraService.getJiraColumns(any(), any(), any())).thenReturn(JiraColumnResult.builder()
			.jiraColumnResponse(Collections.emptyList())
			.jiraColumns(Collections.emptyList())
			.build());
		when(velocityCalculator.calculateVelocity(any())).thenReturn(velocity);
		when(urlGenerator.getUri(any())).thenReturn(mockUrl);

		ReportResponse result = generateReporterService.generateReporter(request);

		assertThat(result).isEqualTo(ReportResponse.builder().velocity(velocity).exportValidityTime(1800000L).build());
	}

	@Test
	void testGenerateReportWithClassification() {
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
			.csvTimeStamp("1683734399999")
			.build();

		Classification classification = Classification.builder()
			.fieldName("Assignee")
			.pairList((List.of(ClassificationNameValuePair.builder().name("shawn").value(1.0D).build())))
			.build();

		when(jiraService.getStoryPointsAndCycleTimeForDoneCards(any(), any(), any(), any())).thenReturn(CardCollection
			.builder()
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
		when(jiraService.getStoryPointsAndCycleTimeForDoneCards(any(), any(), any(), any()))
			.thenReturn(CardCollection.builder()
				.storyPointSum(0)
				.cardsNumber(0)
				.jiraCardDTOList(Collections.emptyList())
				.build());
		when(jiraService.getStoryPointsAndCycleTimeForNonDoneCards(any(), any(), any()))
			.thenReturn(CardCollection.builder()
				.storyPointSum(0)
				.cardsNumber(0)
				.jiraCardDTOList(Collections.emptyList())
				.build());
		when(jiraService.getJiraColumns(any(), any(), any())).thenReturn(JiraColumnResult.builder()
			.jiraColumnResponse(Collections.emptyList())
			.jiraColumns(Collections.emptyList())
			.build());

		ReportResponse result = generateReporterService.generateReporter(request);

		assertThat(result.getClassificationList()).isEqualTo(List.of(classification));
	}

	@Test
	void testGenerateReporterWithDeploymentFrequencyMetric() {
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
			.csvTimeStamp("1683734399999")
			.build();

		DeploymentFrequency deploymentFrequency = DeploymentFrequency.builder()
			.avgDeploymentFrequency(new AvgDeploymentFrequency("Average", 0.10F))
			.build();

		when(buildKiteService.fetchPipelineBuilds(any(), any(), any(), any()))
			.thenReturn(List.of(BuildKiteBuildInfoBuilder.withDefault()
				.withJobs(List.of(BuildKiteJobBuilder.withDefault().build()))
				.withPipelineCreateTime("2022-09-09T04:57:34Z")
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
	void testGenerateReporterWithChangeFailureRateMetric() {
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
			.csvTimeStamp("1683734399999")
			.build();

		ChangeFailureRate changeFailureRate = ChangeFailureRate.builder()
			.avgChangeFailureRate(AvgChangeFailureRate.builder().failureRate(0.1F).build())
			.build();

		when(buildKiteService.fetchPipelineBuilds(any(), any(), any(), any()))
			.thenReturn(List.of(BuildKiteBuildInfoBuilder.withDefault()
				.withJobs(List.of(BuildKiteJobBuilder.withDefault().build()))
				.withPipelineCreateTime("2022-09-09T04:57:34Z")
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
	void testNotGenerateReporterWithNullDevelopmentMetric() {
		BuildKiteSetting buildKiteSetting = BuildKiteSetting.builder()
			.type("BuildKite")
			.token(BUILDKITE_TOKEN)
			.deploymentEnvList(Collections.emptyList())
			.build();
		GenerateReportRequest request = GenerateReportRequest.builder()
			.considerHoliday(false)
			.metrics(List.of("change failure rate"))
			.buildKiteSetting(buildKiteSetting)
			.startTime("1661702400000")
			.endTime("1662739199000")
			.codebaseSetting(null)
			.csvTimeStamp("1683734399999")
			.build();

		when(buildKiteService.fetchPipelineBuilds(any(), any(), any(), any()))
			.thenReturn(List.of(BuildKiteBuildInfoBuilder.withDefault()
				.withJobs(List.of(BuildKiteJobBuilder.withDefault().build()))
				.withPipelineCreateTime("2022-09-09T04:57:34Z")
				.build()));

		when(buildKiteService.countDeployTimes(any(), any(), any(), any())).thenReturn(
				DeployTimesBuilder.withDefault().withPassed(List.of(DeployInfoBuilder.withDefault().build())).build());

		ReportResponse response = generateReporterService.generateReporter(request);

		assertThat(response.getChangeFailureRate()).isNull();
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
			.targetFields(Collections.emptyList())
			.build();
		GenerateReportRequest request = GenerateReportRequest.builder()
			.considerHoliday(false)
			.metrics(List.of("cycle time"))
			.jiraBoardSetting(jiraBoardSetting)
			.startTime("123")
			.endTime("123")
			.csvTimeStamp("1683734399999")
			.build();

		when(jiraService.getStoryPointsAndCycleTimeForDoneCards(any(), any(), any(), any())).thenReturn(cardCollection);
		when(jiraService.getStoryPointsAndCycleTimeForNonDoneCards(any(), any(), any()))
			.thenReturn(CardCollection.builder()
				.storyPointSum(0)
				.cardsNumber(0)
				.jiraCardDTOList(Collections.emptyList())
				.build());
		when(jiraService.getJiraColumns(any(), any(), any())).thenReturn(JiraColumnResult.builder()
			.jiraColumnResponse(Collections.emptyList())
			.jiraColumns(Collections.emptyList())
			.build());
		when(cycleTimeCalculator.calculateCycleTime(cardCollection, request.getJiraBoardSetting().getBoardColumns()))
			.thenReturn(CycleTime.builder().build());

		ReportResponse result = generateReporterService.generateReporter(request);
		ReportResponse expect = ReportResponse.builder()
			.cycleTime(CycleTime.builder().build())
			.exportValidityTime(1800000L)
			.build();

		assertThat(result).isEqualTo(expect);
	}

	@Test
	void testGenerateReporterWithLeadTimeForChangesMetric() {
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
			.metrics(List.of("lead time for changes", "mean time to recovery"))
			.buildKiteSetting(buildKiteSetting)
			.codebaseSetting(codebaseSetting)
			.startTime("1661702400000")
			.endTime("1662739199000")
			.csvTimeStamp("1683734399999")
			.build();

		PipelineLeadTime pipelineLeadTime = PipelineLeadTime.builder()
			.pipelineStep("Step")
			.pipelineName("Name")
			.leadTimes(List.of(LeadTime.builder()
				.commitId("111")
				.prCreatedTime(1658549100000L)
				.prMergedTime(1658549160000L)
				.firstCommitTimeInPr(1658549100000L)
				.jobFinishTime(1658549160000L)
				.pipelineCreateTime(1658549100000L)
				.prLeadTime(60000L)
				.pipelineLeadTime(60000)
				.totalTime(120000)
				.build()))
			.build();

		LeadTimeForChanges mockLeadTimeForChanges = LeadTimeForChanges.builder()
			.leadTimeForChangesOfPipelines(List.of(LeadTimeForChangesOfPipelines.builder()
				.name("Name")
				.step("Step")
				.prLeadTime(1.0)
				.pipelineLeadTime(1.0)
				.totalDelayTime(2.0)
				.build()))
			.avgLeadTimeForChanges(AvgLeadTimeForChanges.builder()
				.name("Average")
				.prLeadTime(1.0)
				.pipelineLeadTime(1.0)
				.totalDelayTime(2.0)
				.build())
			.build();
		val mockMeanToRecovery = createMockMeanToRecovery();

		when(buildKiteService.fetchPipelineBuilds(any(), any(), any(), any()))
			.thenReturn(List.of(BuildKiteBuildInfoBuilder.withDefault()
				.withJobs(List.of(BuildKiteJobBuilder.withDefault().build()))
				.withPipelineCreateTime("2022-09-09T04:57:34Z")
				.build()));
		when(buildKiteService.countDeployTimes(any(), any(), any(), any())).thenReturn(
				DeployTimesBuilder.withDefault().withPassed(List.of(DeployInfoBuilder.withDefault().build())).build());
		when(gitHubService.fetchPipelinesLeadTime(any(), any(), any())).thenReturn(List.of(pipelineLeadTime));
		when(leadTimeForChangesCalculator.calculate(any())).thenReturn(mockLeadTimeForChanges);
		when(meanToRecoveryCalculator.calculate(any())).thenReturn(mockMeanToRecovery);
		ReportResponse result = generateReporterService.generateReporter(request);

		assertThat(result.getLeadTimeForChanges()).isEqualTo(mockLeadTimeForChanges);
		assertThat(result.getMeanTimeToRecovery()).isEqualTo(mockMeanToRecovery);
	}

	@Test
	void shouldGenerateCsvForPipelineWithPipelineMetricAndBuildInfoIsEmpty() throws IOException {
		Path csvFilePath = Path.of("./csv/exportPipelineMetrics-1683734399999.csv");
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
			.metrics(List.of("lead time for changes", "deployment frequency"))
			.buildKiteSetting(buildKiteSetting)
			.codebaseSetting(codebaseSetting)
			.startTime("1661702400000")
			.endTime("1662739199000")
			.csvTimeStamp("1683734399999")
			.build();

		when(buildKiteService.fetchPipelineBuilds(any(), any(), any(), any()))
			.thenReturn(List.of(BuildKiteBuildInfoBuilder.withDefault()
				.withCommit("")
				.withJobs(List.of(BuildKiteJobBuilder.withDefault().withState("broken").build()))
				.build()));
		when(buildKiteService.countDeployTimes(any(), any(), any(), any())).thenReturn(
				DeployTimesBuilder.withDefault().withPassed(List.of(DeployInfoBuilder.withDefault().build())).build());
		when(gitHubService.fetchPipelinesLeadTime(any(), any(), any()))
			.thenReturn(List.of(PipelineCsvFixture.MOCK_PIPELINE_LEAD_TIME_DATA()));

		Mockito.doAnswer(invocation -> {
			Files.createFile(csvFilePath);
			return null;
		}).when(csvFileGenerator).convertPipelineDataToCSV(any(), any());

		generateReporterService.generateReporter(request);

		boolean isExists = Files.exists(csvFilePath);
		Assertions.assertTrue(isExists);
		Files.deleteIfExists(csvFilePath);
	}

	@Test
	void shouldGenerateCsvForPipelineWithPipelineMetric() throws IOException {
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
			.metrics(List.of("lead time for changes", "deployment frequency"))
			.buildKiteSetting(buildKiteSetting)
			.codebaseSetting(codebaseSetting)
			.startTime(String.valueOf(Instant.MIN.getEpochSecond()))
			.endTime(String.valueOf(Instant.MAX.getEpochSecond()))
			.csvTimeStamp("1683734399999")
			.build();

		when(buildKiteService.fetchPipelineBuilds(any(), any(), any(), any()))
			.thenReturn(List.of(BuildKiteBuildInfoBuilder.withDefault()
				.withJobs(List.of(BuildKiteJobBuilder.withDefault().build()))
				.withPipelineCreateTime("2022-09-09T04:57:34Z")
				.build()));
		when(buildKiteService.countDeployTimes(any(), any(), any(), any())).thenReturn(
				DeployTimesBuilder.withDefault().withPassed(List.of(DeployInfoBuilder.withDefault().build())).build());
		when(gitHubService.fetchPipelinesLeadTime(any(), any(), any()))
			.thenReturn(List.of(PipelineCsvFixture.MOCK_PIPELINE_LEAD_TIME_DATA()));
		when(buildKiteService.getStepsBeforeEndStep(any(), any())).thenReturn(List.of("xx"));

		Mockito.doAnswer(invocation -> {
			Files.createFile(mockPipelineCsvPath);
			return null;
		}).when(csvFileGenerator).convertPipelineDataToCSV(any(), any());

		generateReporterService.generateReporter(request);

		boolean isExists = Files.exists(mockPipelineCsvPath);
		Assertions.assertTrue(isExists);
		Files.deleteIfExists(mockPipelineCsvPath);
	}

	@Test
	void shouldNotGenerateCsvForPipelineWithPipelineLeadTimeIsNull() throws IOException {
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
			.pipelineCrews(List.of("xx"))
			.build();

		GenerateReportRequest request = GenerateReportRequest.builder()
			.considerHoliday(true)
			.metrics(List.of("lead time for changes", "deployment frequency"))
			.buildKiteSetting(buildKiteSetting)
			.codebaseSetting(codebaseSetting)
			.startTime(String.valueOf(Instant.MIN.getEpochSecond()))
			.endTime(String.valueOf(Instant.MAX.getEpochSecond()))
			.csvTimeStamp("1683734399999")
			.build();

		when(buildKiteService.fetchPipelineBuilds(any(), any(), any(), any()))
			.thenReturn(List.of(BuildKiteBuildInfoBuilder.withDefault()
				.withCommit("")
				.withJobs(List.of(BuildKiteJobBuilder.withDefault().build()))
				.withPipelineCreateTime("2022-09-09T04:57:34Z")
				.build()));
		when(buildKiteService.countDeployTimes(any(), any(), any(), any())).thenReturn(
				DeployTimesBuilder.withDefault().withPassed(List.of(DeployInfoBuilder.withDefault().build())).build());
		when(gitHubService.fetchPipelinesLeadTime(any(), any(), any())).thenReturn(null);
		when(buildKiteService.getStepsBeforeEndStep(any(), any())).thenReturn(List.of("xx"));

		generateReporterService.generateReporter(request);

		boolean isExists = Files.exists(mockPipelineCsvPath);
		Assertions.assertFalse(isExists);
		Files.deleteIfExists(mockPipelineCsvPath);
	}

	@Test
	void shouldNotGenerateCsvForPipelineWithCommitIsNull() throws IOException {
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
			.pipelineCrews(List.of("xxx"))
			.deploymentEnvList(List.of(mockDeployment))
			.build();

		GenerateReportRequest request = GenerateReportRequest.builder()
			.considerHoliday(true)
			.metrics(List.of("lead time for changes", "deployment frequency"))
			.buildKiteSetting(buildKiteSetting)
			.codebaseSetting(codebaseSetting)
			.startTime(String.valueOf(Instant.MIN.getEpochSecond()))
			.endTime(String.valueOf(Instant.MAX.getEpochSecond()))
			.csvTimeStamp("1683734399999")
			.build();

		when(buildKiteService.fetchPipelineBuilds(any(), any(), any(), any()))
			.thenReturn(List.of(BuildKiteBuildInfoBuilder.withDefault()
				.withJobs(List.of(BuildKiteJobBuilder.withDefault().build()))
				.withPipelineCreateTime("2022-09-09T04:57:34Z")
				.build()));
		when(buildKiteService.countDeployTimes(any(), any(), any(), any())).thenReturn(
				DeployTimesBuilder.withDefault().withPassed(List.of(DeployInfoBuilder.withDefault().build())).build());
		when(gitHubService.fetchPipelinesLeadTime(any(), any(), any())).thenReturn(null);
		when(buildKiteService.getStepsBeforeEndStep(any(), any())).thenReturn(List.of("xx"));

		generateReporterService.generateReporter(request);

		boolean isExists = Files.exists(mockPipelineCsvPath);
		Assertions.assertFalse(isExists);
		Files.deleteIfExists(mockPipelineCsvPath);
	}

	@Test
	void shouldNotGenerateCsvForPipeline() throws IOException {
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
			.metrics(List.of("lead time for changes", "deployment frequency"))
			.buildKiteSetting(buildKiteSetting)
			.codebaseSetting(codebaseSetting)
			.startTime(String.valueOf(Instant.MIN.getEpochSecond()))
			.endTime(String.valueOf(Instant.MAX.getEpochSecond()))
			.csvTimeStamp("1683734399999")
			.build();

		when(buildKiteService.fetchPipelineBuilds(any(), any(), any(), any()))
			.thenReturn(List.of(BuildKiteBuildInfoBuilder.withDefault()
				.withJobs(List.of(BuildKiteJobBuilder.withDefault().build()))
				.withPipelineCreateTime("2022-09-09T04:57:34Z")
				.build()));
		when(buildKiteService.countDeployTimes(any(), any(), any(), any())).thenReturn(
				DeployTimesBuilder.withDefault().withPassed(List.of(DeployInfoBuilder.withDefault().build())).build());
		when(gitHubService.fetchPipelinesLeadTime(any(), any(), any())).thenReturn(null);
		when(buildKiteService.getStepsBeforeEndStep(any(), any())).thenReturn(List.of("xx"));

		generateReporterService.generateReporter(request);

		boolean isExists = Files.exists(mockPipelineCsvPath);
		Assertions.assertFalse(isExists);
		Files.deleteIfExists(mockPipelineCsvPath);
	}

	@Test
	void shouldThrowNotFoundExceptionWhenExportCsvExpire() {
		ExportCSVRequest mockExportCSVRequest = ExportCSVRequest.builder()
			.dataType("pipeline")
			.csvTimeStamp("1685010080107") // csvTimeStamp convert to 2023-5-25 18:21:20
			.build();

		assertThatThrownBy(() -> generateReporterService.fetchCSVData(mockExportCSVRequest))
			.isInstanceOf(NotFoundException.class)
			.hasMessageContaining("csv not found");
	}

	@Test
	void shouldReturnCsvDataForPipelineWhenExportCsv() throws IOException {
		String mockedCsvData = "csv data";
		ExportCSVRequest mockExportCSVRequest = ExportCSVRequest.builder()
			.dataType("pipeline")
			.csvTimeStamp(String.valueOf(System.currentTimeMillis()))
			.build();

		InputStream inputStream = new ByteArrayInputStream(mockedCsvData.getBytes());
		InputStreamResource mockInputStreamResource = new InputStreamResource(inputStream);
		when(csvFileGenerator.getDataFromCSV(any(), anyLong())).thenReturn(mockInputStreamResource);

		InputStreamResource csvDataResource = generateReporterService.fetchCSVData(mockExportCSVRequest);
		InputStream csvDataInputStream = csvDataResource.getInputStream();
		String csvData = new BufferedReader(new InputStreamReader(csvDataInputStream)).lines()
			.collect(Collectors.joining("\n"));

		assertThat(csvData).isEqualTo(mockedCsvData);
	}

	@Test
	void shouldGenerateForBoardCsvWhenCallGenerateReporterWithBoardMetric() throws IOException {
		JiraBoardSetting jiraBoardSetting = JiraBoardSetting.builder()
			.treatFlagCardAsBlock(true)
			.targetFields(BoardCsvFixture.MOCK_TARGET_FIELD_LIST())
			.build();
		GenerateReportRequest request = GenerateReportRequest.builder()
			.metrics(List.of("velocity"))
			.considerHoliday(false)
			.jiraBoardSetting(jiraBoardSetting)
			.startTime("123")
			.endTime("123")
			.csvTimeStamp("1683734399999")
			.build();

		URI mockUrl = URI.create(SITE_ATLASSIAN_NET);

		when(jiraService.getStoryPointsAndCycleTimeForDoneCards(any(), any(), any(), any()))
			.thenReturn(CardCollection.builder()
				.storyPointSum(2)
				.cardsNumber(1)
				.jiraCardDTOList(BoardCsvFixture.MOCK_DONE_CARD_LIST())
				.build());
		when(jiraService.getStoryPointsAndCycleTimeForNonDoneCards(any(), any(), any()))
			.thenReturn(CardCollection.builder()
				.storyPointSum(2)
				.cardsNumber(1)
				.jiraCardDTOList(BoardCsvFixture.MOCK_NON_DONE_CARD_LIST())
				.build());
		when(jiraService.getJiraColumns(any(), any(), any())).thenReturn(JiraColumnResult.builder()
			.jiraColumnResponse(BoardCsvFixture.MOCK_JIRA_COLUMN_LIST())
			.jiraColumns(Collections.emptyList())
			.build());
		when(urlGenerator.getUri(any())).thenReturn(mockUrl);
		Mockito.doAnswer(invocation -> {
			Files.createFile(mockBoardCsvPath);
			return null;
		}).when(csvFileGenerator).convertBoardDataToCSV(any(), any(), any(), any());

		generateReporterService.generateReporter(request);

		boolean isExists = Files.exists(mockBoardCsvPath);
		Assertions.assertTrue(isExists);
		Files.deleteIfExists(mockBoardCsvPath);
	}

	@Test
	void shouldDeleteExpireCsvWhenExportCsvWithCsvOutsideThirtyMinutes() throws IOException {
		Files.createFile(mockPipelineCsvPath);

		generateReporterService.deleteExpireCSV(System.currentTimeMillis(), new File("./csv/"));

		boolean isFileDeleted = Files.notExists(mockPipelineCsvPath);
		Assertions.assertTrue(isFileDeleted);
	}

	@Test
	void shouldNotDeleteOldCsvWhenExportCsvWithoutOldCsvInsideThirtyMinutes() throws IOException {
		long currentTimeStamp = System.currentTimeMillis();
		Path csvFilePath = Path.of(String.format("./csv/exportPipelineMetrics-%s.csv", currentTimeStamp));
		Files.createFile(csvFilePath);

		generateReporterService.deleteExpireCSV(currentTimeStamp - 800000, new File("./csv/"));

		boolean isFileDeleted = Files.notExists(csvFilePath);
		Assertions.assertFalse(isFileDeleted);
		Files.deleteIfExists(csvFilePath);
	}

	@Test
	void shouldDeleteFailWhenDeleteCSV() {
		File mockFile = mock(File.class);
		when(mockFile.getName()).thenReturn("file1-1683734399999.CSV");
		when(mockFile.delete()).thenReturn(false);
		File[] mockFiles = new File[] { mockFile };
		File directory = mock(File.class);
		when(directory.listFiles()).thenReturn(mockFiles);

		Boolean deleteStatus = generateReporterService.deleteExpireCSV(System.currentTimeMillis(), directory);

		Assertions.assertTrue(deleteStatus);
	}

	@Test
	void shouldThrowExceptionWhenDeleteCSV() {
		File mockFile = mock(File.class);
		when(mockFile.getName()).thenReturn("file1-1683734399999.CSV");
		when(mockFile.delete()).thenThrow(new RuntimeException("test"));
		File[] mockFiles = new File[] { mockFile };
		File directory = mock(File.class);
		when(directory.listFiles()).thenReturn(mockFiles);

		Boolean deleteStatus = generateReporterService.deleteExpireCSV(System.currentTimeMillis(), directory);

		Assertions.assertFalse(deleteStatus);
	}

	private MeanTimeToRecovery createMockMeanToRecovery() {
		return MeanTimeToRecovery.builder()
			.meanTimeRecoveryPipelines(List.of(MeanTimeToRecoveryOfPipeline.builder().build()))
			.avgMeanTimeToRecovery(AvgMeanTimeToRecovery.builder().build())
			.build();
	}

	@Test
	void shouldReturnTrueWhenReportIsReady() {
		// given
		String fileTimeStamp = Long.toString(System.currentTimeMillis());
		// when
		when(asyncReportRequestHandler.isReportReady(fileTimeStamp)).thenReturn(true);
		boolean generateReportIsOver = generateReporterService.checkGenerateReportIsDone(fileTimeStamp);
		// then
		assertTrue(generateReportIsOver);
	}

	@Test
	void shouldReturnFalseWhenReportIsNotReady() {
		// given
		String fileTimeStamp = Long.toString(System.currentTimeMillis());
		asyncReportRequestHandler.putReport("111111111", MetricCsvFixture.MOCK_METRIC_CSV_DATA_WITH_ONE_PIPELINE());
		// when
		boolean generateReportIsOver = generateReporterService.checkGenerateReportIsDone(fileTimeStamp);
		// then
		assertFalse(generateReportIsOver);

	}

	@Test
	void shouldThrowExceptionWhenTimeOutOf30m() {
		// given
		String fileExpiredTimeStamp = Long.toString(System.currentTimeMillis() - 1900000L);
		// when & then
		GenerateReportException generateReportException = assertThrows(GenerateReportException.class,
				() -> generateReporterService.checkGenerateReportIsDone(fileExpiredTimeStamp));
		assertEquals(500, generateReportException.getStatus());
		assertEquals("Report time expires", generateReportException.getMessage());
	}

	@Test
	void shouldReturnReportResponse() {
		String reportId = Long.toString(System.currentTimeMillis());
		// when
		when(asyncReportRequestHandler.getReport(reportId))
			.thenReturn(MetricCsvFixture.MOCK_METRIC_CSV_DATA_WITH_ONE_PIPELINE());
		ReportResponse reportResponse = generateReporterService.getReportFromHandler(reportId);
		// then
		assertEquals(MetricCsvFixture.MOCK_METRIC_CSV_DATA_WITH_ONE_PIPELINE().getClassificationList(),
				reportResponse.getClassificationList());
		assertEquals(MetricCsvFixture.MOCK_METRIC_CSV_DATA_WITH_ONE_PIPELINE().getExportValidityTime(),
				reportResponse.getExportValidityTime());
		assertEquals(MetricCsvFixture.MOCK_METRIC_CSV_DATA_WITH_ONE_PIPELINE().getCycleTime(),
				reportResponse.getCycleTime());
	}

	@Test
	void shouldThrowUnauthorizedExceptionWhenCheckGenerateReportIsDone() {
		// given
		String reportId = Long.toString(System.currentTimeMillis());
		// when
		when(asyncExceptionHandler.get(reportId))
			.thenReturn(new UnauthorizedException("Failed to get GitHub info_status: 401, reason: PermissionDeny"));
		BaseException exception = assertThrows(UnauthorizedException.class,
				() -> generateReporterService.checkGenerateReportIsDone(reportId));
		// then
		assertEquals(401, exception.getStatus());
		assertEquals("Failed to get GitHub info_status: 401, reason: PermissionDeny", exception.getMessage());
	}

	@Test
	void shouldThrowPermissionDenyExceptionWhenCheckGenerateReportIsDone() {
		// given
		String reportId = Long.toString(System.currentTimeMillis());
		asyncExceptionHandler.put(reportId,
				new PermissionDenyException("Failed to get GitHub info_status: 403, reason: PermissionDeny"));
		// when
		when(asyncExceptionHandler.get(reportId))
			.thenReturn(new PermissionDenyException("Failed to get GitHub info_status: 403, reason: PermissionDeny"));
		BaseException exception = assertThrows(PermissionDenyException.class,
				() -> generateReporterService.checkGenerateReportIsDone(reportId));
		// then
		assertEquals(403, exception.getStatus());
		assertEquals("Failed to get GitHub info_status: 403, reason: PermissionDeny", exception.getMessage());
	}

	@Test
	void shouldThrowNotFoundExceptionWhenCheckGenerateReportIsDone() {
		// given
		String reportId = Long.toString(System.currentTimeMillis());
		// when
		when(asyncExceptionHandler.get(reportId))
			.thenReturn(new NotFoundException("Failed to get GitHub info_status: 404, reason: NotFound"));
		BaseException exception = assertThrows(NotFoundException.class,
				() -> generateReporterService.checkGenerateReportIsDone(reportId));
		// then
		assertEquals(404, exception.getStatus());
		assertEquals("Failed to get GitHub info_status: 404, reason: NotFound", exception.getMessage());
	}

	@Test
	void shouldThrowGenerateReportExceptionWhenCheckGenerateReportIsDone() {
		// given
		String reportId = Long.toString(System.currentTimeMillis());
		// when
		when(asyncExceptionHandler.get(reportId))
			.thenReturn(new GenerateReportException("Failed to get GitHub info_status: 500, reason: GenerateReport"));
		BaseException exception = assertThrows(GenerateReportException.class,
				() -> generateReporterService.checkGenerateReportIsDone(reportId));
		// then
		assertEquals(500, exception.getStatus());
		assertEquals("Failed to get GitHub info_status: 500, reason: GenerateReport", exception.getMessage());
	}

	@Test
	void shouldThrowServiceUnavailableExceptionWhenCheckGenerateReportIsDone() {
		// given
		String reportId = Long.toString(System.currentTimeMillis());
		// when
		when(asyncExceptionHandler.get(reportId)).thenReturn(
				new ServiceUnavailableException("Failed to get GitHub info_status: 503, reason: ServiceUnavailable"));
		BaseException exception = assertThrows(ServiceUnavailableException.class,
				() -> generateReporterService.checkGenerateReportIsDone(reportId));
		// then
		assertEquals(503, exception.getStatus());
		assertEquals("Failed to get GitHub info_status: 503, reason: ServiceUnavailable", exception.getMessage());
	}

	@Test
	void shouldThrowRequestFailedExceptionWhenCheckGenerateReportIsDone() {
		// given
		String reportId = Long.toString(System.currentTimeMillis());
		// when
		when(asyncExceptionHandler.get(reportId)).thenReturn(new RequestFailedException(405, "RequestFailedException"));
		BaseException exception = assertThrows(RequestFailedException.class,
				() -> generateReporterService.checkGenerateReportIsDone(reportId));
		// then
		assertEquals(405, exception.getStatus());
		assertEquals(
				"Request failed with status statusCode 405, error: Request failed with status statusCode 405, error: RequestFailedException",
				exception.getMessage());
	}

	@Test
	void shouldThrowBadRequestExceptionGivenMetricsContainKanbanWhenJiraSettingIsNull() {
		GenerateReportRequest request = GenerateReportRequest.builder()
			.considerHoliday(false)
			.metrics(List.of(RequireDataEnum.CYCLE_TIME.getValue()))
			.jiraBoardSetting(null)
			.startTime("123")
			.endTime("123")
			.csvTimeStamp("1683734399999")
			.build();

		BadRequestException badRequestException = assertThrows(BadRequestException.class,
				() -> generateReporterService.generateReporter(request));
		assertEquals("Jira board setting is null.", badRequestException.getMessage());
	}

	@Test
	void shouldThrowBadRequestExceptionGivenMetricsContainCodeBaseWhenCodeBaseSettingIsNull() {
		GenerateReportRequest request = GenerateReportRequest.builder()
			.considerHoliday(false)
			.metrics(List.of(RequireDataEnum.LEAD_TIME_FOR_CHANGES.getValue()))
			.codebaseSetting(null)
			.startTime("123")
			.endTime("123")
			.csvTimeStamp("1683734399999")
			.build();

		BadRequestException badRequestException = assertThrows(BadRequestException.class,
				() -> generateReporterService.generateReporter(request));
		assertEquals("Code base setting is null.", badRequestException.getMessage());
	}

	@Test
	void shouldThrowBadRequestExceptionGivenMetricsContainBuildKiteWhenBuildKiteSettingIsNull() {
		GenerateReportRequest request = GenerateReportRequest.builder()
			.considerHoliday(false)
			.metrics(List.of(RequireDataEnum.CHANGE_FAILURE_RATE.getValue()))
			.buildKiteSetting(null)
			.startTime("123")
			.endTime("123")
			.csvTimeStamp("1683734399999")
			.build();

		BadRequestException badRequestException = assertThrows(BadRequestException.class,
				() -> generateReporterService.generateReporter(request));
		assertEquals("BuildKite setting is null.", badRequestException.getMessage());
	}

	@Test
	void shouldInitializeValueFalseGivenPreviousMapperIsNullWhenInitializeRelatedMetricsReady() {
		String timeStamp = "1683734399999";
		List<String> metrics = List.of(RequireDataEnum.CYCLE_TIME.getValue());
		MetricsDataReady expectedPut = MetricsDataReady.builder()
			.boardMetricsReady(false)
			.pipelineMetricsReady(null)
			.sourceControlMetricsReady(null)
			.build();

		when(asyncReportRequestHandler.getMetricsDataReady(timeStamp)).thenReturn(null);

		generateReporterService.initializeMetricsDataReadyInHandler(timeStamp, metrics);
		verify(asyncReportRequestHandler).putMetricsDataReady(timeStamp, expectedPut);
	}

	@Test
	void shouldReturnPreviousValueGivenPreviousValueExistWhenInitializeRelatedMetricsReady() {
		String timeStamp = "1683734399999";
		List<String> metrics = List.of(RequireDataEnum.CYCLE_TIME.getValue(),
				RequireDataEnum.DEPLOYMENT_FREQUENCY.getValue());
		MetricsDataReady previousMetricsDataReady = MetricsDataReady.builder()
			.boardMetricsReady(false)
			.pipelineMetricsReady(null)
			.sourceControlMetricsReady(null)
			.build();
		MetricsDataReady expectedPut = MetricsDataReady.builder()
			.boardMetricsReady(false)
			.pipelineMetricsReady(false)
			.sourceControlMetricsReady(null)
			.build();

		when(asyncReportRequestHandler.getMetricsDataReady(timeStamp)).thenReturn(previousMetricsDataReady);

		generateReporterService.initializeMetricsDataReadyInHandler(timeStamp, metrics);
		verify(asyncReportRequestHandler).putMetricsDataReady(timeStamp, expectedPut);
	}

	@Test
	void shouldUpdateAndSetMetricsReadyTrueWhenThreeMetricsExistsAndPreviousMetricsReadyNotNull(){
		GenerateReportRequest request = GenerateReportRequest.builder()
			.considerHoliday(false)
			.metrics(List.of("velocity","cycle time","classification","deployment frequency","change failure rate","mean time to recovery","lead time for changes"))
			.jiraBoardSetting(buildJiraBoardSetting())
			.buildKiteSetting(buildPipelineSetting())
			.codebaseSetting(buildCodeBaseSetting())
			.startTime("123")
			.endTime("123")
			.csvTimeStamp("1683734399999")
			.build();

		MetricsDataReady previousReady= MetricsDataReady.builder()
			.boardMetricsReady(false)
			.pipelineMetricsReady(false)
			.sourceControlMetricsReady(false).build();
		MetricsDataReady allMetricsReady = MetricsDataReady.builder()
			.pipelineMetricsReady(true)
			.boardMetricsReady(true)
			.sourceControlMetricsReady(true)
			.build();

		//when
		when(asyncReportRequestHandler.getMetricsDataReady(anyString())).thenReturn(previousReady);

		generateReporterService.updateMetricsDataReadyInHandler(request.getCsvTimeStamp(),request.getMetrics());
		//then
		verify(asyncReportRequestHandler,times(1)).putMetricsDataReady(request.getCsvTimeStamp(),allMetricsReady);
	}


	@Test
	public void shouldThrowExceptionWhenUpdatingMetricsReadyAndPreviousMetricsDataReadyNull(){
		GenerateReportRequest request = GenerateReportRequest.builder()
			.considerHoliday(false)
			.metrics(List.of("velocity","cycle time","classification","deployment frequency","change failure rate","mean time to recovery","lead time for changes"))
			.jiraBoardSetting(buildJiraBoardSetting())
			.buildKiteSetting(buildPipelineSetting())
			.codebaseSetting(buildCodeBaseSetting())
			.startTime("123")
			.endTime("123")
			.csvTimeStamp("1683734399999")
			.build();

		when(asyncReportRequestHandler.getMetricsDataReady(anyString())).thenReturn(null);

		assertThrows(GenerateReportException.class,()-> generateReporterService.updateMetricsDataReadyInHandler(request.getCsvTimeStamp(),request.getMetrics()));

	}

	@Test
	public void shouldOnlyMetricsWhenMetricsIsNonNullInPreviousMetricsReady(){
		GenerateReportRequest request = GenerateReportRequest.builder()
			.considerHoliday(false)
			.metrics(List.of("velocity","cycle time","classification"))
			.jiraBoardSetting(buildJiraBoardSetting())
			.buildKiteSetting(buildPipelineSetting())
			.codebaseSetting(buildCodeBaseSetting())
			.startTime("123")
			.endTime("123")
			.csvTimeStamp("1683734399999")
			.build();
		MetricsDataReady previousReady= MetricsDataReady.builder()
			.boardMetricsReady(false)
			.pipelineMetricsReady(null)
			.sourceControlMetricsReady(null)
			.build();
		MetricsDataReady allMetricsReady = MetricsDataReady.builder()
			.boardMetricsReady(true)
			.pipelineMetricsReady(null)
			.sourceControlMetricsReady(null)
			.build();

		when(asyncReportRequestHandler.getMetricsDataReady(anyString())).thenReturn(previousReady);

		generateReporterService.updateMetricsDataReadyInHandler(request.getCsvTimeStamp(),request.getMetrics());
		//then
		verify(asyncReportRequestHandler,times(1)).putMetricsDataReady(request.getCsvTimeStamp(),allMetricsReady);
	}
	private JiraBoardSetting buildJiraBoardSetting(){
		return JiraBoardSetting.builder()
			.treatFlagCardAsBlock(true)
			.targetFields(BoardCsvFixture.MOCK_TARGET_FIELD_LIST())
			.build();
	}

	private BuildKiteSetting buildPipelineSetting(){
		DeploymentEnvironment mockDeployment = DeploymentEnvironmentBuilder.withDefault().build();
		mockDeployment.setRepository("https://github.com/XXXX-fs/fs-platform-onboarding");
		return BuildKiteSetting.builder()
			.type("BuildKite")
			.token("buildKite_fake_token")
			.deploymentEnvList(List.of(mockDeployment))
			.build();
	}

	private CodebaseSetting buildCodeBaseSetting(){
		DeploymentEnvironment mockDeployment = DeploymentEnvironmentBuilder.withDefault().build();
		mockDeployment.setRepository("https://github.com/XXXX-fs/fs-platform-onboarding");
		return CodebaseSetting.builder()
			.type("Github")
			.token("github_fake_token")
			.leadTime(List.of(mockDeployment))
			.build();
	}
}
