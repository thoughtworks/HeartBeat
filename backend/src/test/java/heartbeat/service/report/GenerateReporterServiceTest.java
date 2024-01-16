package heartbeat.service.report;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import heartbeat.controller.pipeline.dto.request.PipelineType;
import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.request.JiraBoardSetting;
import heartbeat.controller.report.dto.request.CodebaseSetting;
import heartbeat.controller.report.dto.request.BuildKiteSetting;
import heartbeat.controller.report.dto.request.RequireDataEnum;
import heartbeat.controller.report.dto.response.AvgMeanTimeToRecovery;
import heartbeat.controller.report.dto.response.AvgChangeFailureRate;
import heartbeat.controller.report.dto.response.AvgDeploymentFrequency;
import heartbeat.controller.report.dto.response.ChangeFailureRate;
import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.controller.report.dto.response.MetricsDataCompleted;
import heartbeat.controller.report.dto.response.DeploymentFrequency;
import heartbeat.controller.report.dto.response.Classification;
import heartbeat.controller.report.dto.response.LeadTimeForChanges;
import heartbeat.controller.report.dto.response.Velocity;
import heartbeat.controller.report.dto.response.ClassificationNameValuePair;
import heartbeat.controller.report.dto.response.CycleTime;
import heartbeat.controller.report.dto.response.LeadTimeForChangesOfPipelines;
import heartbeat.controller.report.dto.response.MeanTimeToRecovery;
import heartbeat.controller.report.dto.response.AvgLeadTimeForChanges;
import heartbeat.controller.report.dto.response.MeanTimeToRecoveryOfPipeline;
import heartbeat.controller.report.dto.response.ErrorInfo;
import heartbeat.controller.source.SourceType;
import heartbeat.exception.BaseException;
import heartbeat.exception.BadRequestException;
import heartbeat.exception.NotFoundException;
import heartbeat.exception.GenerateReportException;
import heartbeat.exception.UnauthorizedException;
import heartbeat.exception.PermissionDenyException;
import heartbeat.exception.ServiceUnavailableException;
import heartbeat.exception.RequestFailedException;
import heartbeat.handler.AsyncExceptionHandler;
import heartbeat.handler.AsyncReportRequestHandler;
import heartbeat.service.board.jira.JiraColumnResult;
import heartbeat.service.board.jira.JiraService;
import heartbeat.service.pipeline.buildkite.BuildKiteService;
import heartbeat.service.pipeline.buildkite.builder.BuildKiteJobBuilder;
import heartbeat.service.pipeline.buildkite.builder.BuildKiteBuildInfoBuilder;
import heartbeat.service.pipeline.buildkite.builder.DeployTimesBuilder;
import heartbeat.service.pipeline.buildkite.builder.DeployInfoBuilder;
import heartbeat.service.pipeline.buildkite.builder.DeploymentEnvironmentBuilder;
import heartbeat.service.report.calculator.CycleTimeCalculator;
import heartbeat.service.report.calculator.MeanToRecoveryCalculator;
import heartbeat.service.report.calculator.ClassificationCalculator;
import heartbeat.service.report.calculator.ChangeFailureRateCalculator;
import heartbeat.service.report.calculator.VelocityCalculator;
import heartbeat.service.report.calculator.DeploymentFrequencyCalculator;
import heartbeat.service.source.github.GitHubService;
import heartbeat.util.IdUtil;
import lombok.val;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;

import static heartbeat.TestFixtures.BUILDKITE_TOKEN;
import static heartbeat.TestFixtures.GITHUB_REPOSITORY;
import static heartbeat.TestFixtures.GITHUB_TOKEN;
import static heartbeat.service.report.CycleTimeFixture.JIRA_BOARD_COLUMNS_SETTING;
import static heartbeat.service.report.CycleTimeFixture.MOCK_CARD_COLLECTION;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.internal.verification.VerificationModeFactory.times;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class GenerateReporterServiceTest {

	public static final String SITE_ATLASSIAN_NET = "https://site.atlassian.net";

	private static final String REQUEST_FILE_PATH = "src/test/java/heartbeat/controller/report/request.json";

	private static final String RESPONSE_FILE_PATH = "src/test/java/heartbeat/controller/report/reportResponse.json";

	private static final String TIMESTAMP = "1683734399999";

	private static final String CSV_TIMESTAMP = "20240109232359";

	@InjectMocks
	GenerateReporterService generateReporterService;

	@Mock
	JiraService jiraService;

	@Mock
	IdUtil idUtil;

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
	private ArgumentCaptor<MetricsDataCompleted> metricsCaptor;

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
			.csvTimeStamp(TIMESTAMP)
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
			.csvTimeStamp(TIMESTAMP)
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
			.type(PipelineType.BUILDKITE.name())
			.token(BUILDKITE_TOKEN)
			.deploymentEnvList(List.of(mockDeployment))
			.build();

		GenerateReportRequest request = GenerateReportRequest.builder()
			.considerHoliday(false)
			.metrics(List.of("deployment frequency"))
			.buildKiteSetting(buildKiteSetting)
			.startTime("1661702400000")
			.endTime("1662739199000")
			.csvTimeStamp(TIMESTAMP)
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
			.type(PipelineType.BUILDKITE.name())
			.token(BUILDKITE_TOKEN)
			.deploymentEnvList(List.of(mockDeployment))
			.build();
		GenerateReportRequest request = GenerateReportRequest.builder()
			.considerHoliday(false)
			.metrics(List.of("change failure rate"))
			.buildKiteSetting(buildKiteSetting)
			.startTime("1661702400000")
			.endTime("1662739199000")
			.csvTimeStamp(TIMESTAMP)
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
			.type(PipelineType.BUILDKITE.name())
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
			.csvTimeStamp(TIMESTAMP)
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
			.csvTimeStamp(TIMESTAMP)
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
		mockDeployment.setRepository(GITHUB_REPOSITORY);

		CodebaseSetting codebaseSetting = CodebaseSetting.builder()
			.type(SourceType.GITHUB.name())
			.token(GITHUB_TOKEN)
			.leadTime(List.of(mockDeployment))
			.build();

		BuildKiteSetting buildKiteSetting = BuildKiteSetting.builder()
			.type(PipelineType.BUILDKITE.name())
			.token(BUILDKITE_TOKEN)
			.deploymentEnvList(List.of(mockDeployment))
			.build();

		GenerateReportRequest request = GenerateReportRequest.builder()
			.considerHoliday(true)
			.metrics(List.of("lead time for changes", "mean time to recovery"))
			.buildKiteSetting(buildKiteSetting)
			.codebaseSetting(codebaseSetting)
			.startTime("1661702400000")
			.endTime("1662739199000")
			.csvTimeStamp(TIMESTAMP)
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
		mockDeployment.setRepository(GITHUB_REPOSITORY);

		CodebaseSetting codebaseSetting = CodebaseSetting.builder()
			.type(SourceType.GITHUB.name())
			.token(GITHUB_TOKEN)
			.leadTime(List.of(mockDeployment))
			.build();

		BuildKiteSetting buildKiteSetting = BuildKiteSetting.builder()
			.type(PipelineType.BUILDKITE.name())
			.token(BUILDKITE_TOKEN)
			.deploymentEnvList(List.of(mockDeployment))
			.build();

		GenerateReportRequest request = GenerateReportRequest.builder()
			.considerHoliday(true)
			.metrics(List.of("lead time for changes", "deployment frequency"))
			.buildKiteSetting(buildKiteSetting)
			.codebaseSetting(codebaseSetting)
			.startTime("1661702400000")
			.endTime("1662739199000")
			.csvTimeStamp(TIMESTAMP)
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

		doAnswer(invocation -> {
			Files.createFile(csvFilePath);
			return null;
		}).when(csvFileGenerator).convertPipelineDataToCSV(any(), any());

		generateReporterService.generateDoraReport(request);

		boolean isExists = Files.exists(csvFilePath);
		assertTrue(isExists);
		Files.deleteIfExists(csvFilePath);
	}

	@Test
	void shouldGenerateCsvForPipelineWithPipelineMetric() throws IOException {
		DeploymentEnvironment mockDeployment = DeploymentEnvironmentBuilder.withDefault().build();
		mockDeployment.setRepository(GITHUB_REPOSITORY);

		CodebaseSetting codebaseSetting = CodebaseSetting.builder()
			.type(SourceType.GITHUB.name())
			.token(GITHUB_TOKEN)
			.leadTime(List.of(mockDeployment))
			.build();

		BuildKiteSetting buildKiteSetting = BuildKiteSetting.builder()
			.type(PipelineType.BUILDKITE.name())
			.token(BUILDKITE_TOKEN)
			.deploymentEnvList(List.of(mockDeployment))
			.build();

		GenerateReportRequest request = GenerateReportRequest.builder()
			.considerHoliday(true)
			.metrics(List.of("lead time for changes", "deployment frequency"))
			.buildKiteSetting(buildKiteSetting)
			.codebaseSetting(codebaseSetting)
			.startTime(String.valueOf(Instant.MIN.getEpochSecond()))
			.endTime(String.valueOf(Instant.MAX.getEpochSecond()))
			.csvTimeStamp(TIMESTAMP)
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

		doAnswer(invocation -> {
			Files.createFile(mockPipelineCsvPath);
			return null;
		}).when(csvFileGenerator).convertPipelineDataToCSV(any(), any());

		generateReporterService.generateDoraReport(request);

		boolean isExists = Files.exists(mockPipelineCsvPath);
		assertTrue(isExists);
		Files.deleteIfExists(mockPipelineCsvPath);
	}

	@Test
	void shouldNotGenerateCsvForPipelineWithPipelineLeadTimeIsNull() throws IOException {
		DeploymentEnvironment mockDeployment = DeploymentEnvironmentBuilder.withDefault().build();
		mockDeployment.setRepository(GITHUB_REPOSITORY);

		CodebaseSetting codebaseSetting = CodebaseSetting.builder()
			.type(SourceType.GITHUB.name())
			.token(GITHUB_TOKEN)
			.leadTime(List.of(mockDeployment))
			.build();

		BuildKiteSetting buildKiteSetting = BuildKiteSetting.builder()
			.type(PipelineType.BUILDKITE.name())
			.token(BUILDKITE_TOKEN)
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
			.csvTimeStamp(TIMESTAMP)
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

		generateReporterService.generateDoraReport(request);

		boolean isExists = Files.exists(mockPipelineCsvPath);
		assertFalse(isExists);
		Files.deleteIfExists(mockPipelineCsvPath);
	}

	@Test
	void shouldNotGenerateCsvForPipelineWithCommitIsNull() throws IOException {
		DeploymentEnvironment mockDeployment = DeploymentEnvironmentBuilder.withDefault().build();
		mockDeployment.setRepository(GITHUB_REPOSITORY);

		CodebaseSetting codebaseSetting = CodebaseSetting.builder()
			.type(SourceType.GITHUB.name())
			.token(GITHUB_TOKEN)
			.leadTime(List.of(mockDeployment))
			.build();

		BuildKiteSetting buildKiteSetting = BuildKiteSetting.builder()
			.type(PipelineType.BUILDKITE.name())
			.token(BUILDKITE_TOKEN)
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
			.csvTimeStamp(TIMESTAMP)
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

		generateReporterService.generateDoraReport(request);

		boolean isExists = Files.exists(mockPipelineCsvPath);
		assertFalse(isExists);
		Files.deleteIfExists(mockPipelineCsvPath);
	}

	@Test
	void shouldNotGenerateCsvForPipeline() throws IOException {
		DeploymentEnvironment mockDeployment = DeploymentEnvironmentBuilder.withDefault().build();
		mockDeployment.setRepository(GITHUB_REPOSITORY);

		CodebaseSetting codebaseSetting = CodebaseSetting.builder()
			.type(SourceType.GITHUB.name())
			.token(GITHUB_TOKEN)
			.leadTime(List.of(mockDeployment))
			.build();

		BuildKiteSetting buildKiteSetting = BuildKiteSetting.builder()
			.type(PipelineType.BUILDKITE.name())
			.token(BUILDKITE_TOKEN)
			.deploymentEnvList(List.of(mockDeployment))
			.build();

		GenerateReportRequest request = GenerateReportRequest.builder()
			.considerHoliday(true)
			.metrics(List.of("lead time for changes", "deployment frequency"))
			.buildKiteSetting(buildKiteSetting)
			.codebaseSetting(codebaseSetting)
			.startTime(String.valueOf(Instant.MIN.getEpochSecond()))
			.endTime(String.valueOf(Instant.MAX.getEpochSecond()))
			.csvTimeStamp(TIMESTAMP)
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

		generateReporterService.generateDoraReport(request);

		boolean isExists = Files.exists(mockPipelineCsvPath);
		assertFalse(isExists);
		Files.deleteIfExists(mockPipelineCsvPath);
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
			.csvTimeStamp(TIMESTAMP)
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
		doAnswer(invocation -> {
			Files.createFile(mockBoardCsvPath);
			return null;
		}).when(csvFileGenerator).convertBoardDataToCSV(any(), any(), any(), any());

		generateReporterService.generateReporter(request);

		boolean isExists = Files.exists(mockBoardCsvPath);
		assertTrue(isExists);
		Files.deleteIfExists(mockBoardCsvPath);
	}

	@Test
	void shouldDeleteExpireCsvWhenExportCsvWithCsvOutsideThirtyMinutes() throws IOException {
		Files.createFile(mockPipelineCsvPath);

		generateReporterService.deleteExpireCSV(System.currentTimeMillis(), new File("./csv/"));

		boolean isFileDeleted = Files.notExists(mockPipelineCsvPath);
		assertTrue(isFileDeleted);
	}

	@Test
	void shouldNotDeleteOldCsvWhenExportCsvWithoutOldCsvInsideThirtyMinutes() throws IOException {
		long currentTimeStamp = System.currentTimeMillis();
		Path csvFilePath = Path.of(String.format("./csv/exportPipelineMetrics-%s.csv", currentTimeStamp));
		Files.createFile(csvFilePath);

		generateReporterService.deleteExpireCSV(currentTimeStamp - 800000, new File("./csv/"));

		boolean isFileDeleted = Files.notExists(csvFilePath);
		assertFalse(isFileDeleted);
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

		assertTrue(deleteStatus);
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

		assertFalse(deleteStatus);
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
		assertEquals("Failed to get report due to report time expires", generateReportException.getMessage());
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
		String timeStamp = Long.toString(System.currentTimeMillis());
		String reportId = IdUtil.getPipelineReportId(timeStamp);

		when(asyncExceptionHandler.get(reportId))
			.thenReturn(new UnauthorizedException("Failed to get GitHub info_status: 401, reason: PermissionDeny"));

		ErrorInfo pipelineError = generateReporterService.getReportErrorAndHandleAsyncException(timeStamp)
			.getPipelineError();

		assertEquals(401, pipelineError.getStatus());
		assertEquals("Failed to get GitHub info_status: 401, reason: PermissionDeny", pipelineError.getErrorMessage());
	}

	@Test
	void shouldThrowPermissionDenyExceptionWhenCheckGenerateReportIsDone() {
		String timeStamp = Long.toString(System.currentTimeMillis());
		String reportId = IdUtil.getPipelineReportId(timeStamp);
		asyncExceptionHandler.put(reportId,
				new PermissionDenyException("Failed to get GitHub info_status: 403, reason: PermissionDeny"));

		when(asyncExceptionHandler.get(reportId))
			.thenReturn(new PermissionDenyException("Failed to get GitHub info_status: 403, reason: PermissionDeny"));
		ErrorInfo pipelineError = generateReporterService.getReportErrorAndHandleAsyncException(timeStamp)
			.getPipelineError();

		assertEquals(403, pipelineError.getStatus());
		assertEquals("Failed to get GitHub info_status: 403, reason: PermissionDeny", pipelineError.getErrorMessage());
	}

	@Test
	void shouldThrowNotFoundExceptionWhenCheckGenerateReportIsDone() {
		String timeStamp = Long.toString(System.currentTimeMillis());
		String reportId = IdUtil.getPipelineReportId(timeStamp);

		when(asyncExceptionHandler.get(reportId))
			.thenReturn(new NotFoundException("Failed to get GitHub info_status: 404, reason: NotFound"));
		ErrorInfo pipelineError = generateReporterService.getReportErrorAndHandleAsyncException(timeStamp)
			.getPipelineError();

		assertEquals(404, pipelineError.getStatus());
		assertEquals("Failed to get GitHub info_status: 404, reason: NotFound", pipelineError.getErrorMessage());
	}

	@Test
	void shouldThrowGenerateReportExceptionWhenCheckGenerateReportIsDone() {
		String timeStamp = Long.toString(System.currentTimeMillis());
		String reportId = IdUtil.getPipelineReportId(timeStamp);

		when(asyncExceptionHandler.get(reportId))
			.thenReturn(new GenerateReportException("Failed to get GitHub info_status: 500, reason: GenerateReport"));
		BaseException exception = assertThrows(GenerateReportException.class,
				() -> generateReporterService.getReportErrorAndHandleAsyncException(timeStamp));

		assertEquals(500, exception.getStatus());
		assertEquals("Failed to get GitHub info_status: 500, reason: GenerateReport", exception.getMessage());
	}

	@Test
	void shouldThrowServiceUnavailableExceptionWhenCheckGenerateReportIsDone() {
		String timeStamp = Long.toString(System.currentTimeMillis());
		String reportId = IdUtil.getPipelineReportId(timeStamp);

		when(asyncExceptionHandler.get(reportId)).thenReturn(
				new ServiceUnavailableException("Failed to get GitHub info_status: 503, reason: ServiceUnavailable"));
		BaseException exception = assertThrows(ServiceUnavailableException.class,
				() -> generateReporterService.getReportErrorAndHandleAsyncException(timeStamp));

		assertEquals(503, exception.getStatus());
		assertEquals("Failed to get GitHub info_status: 503, reason: ServiceUnavailable", exception.getMessage());
	}

	@Test
	void shouldThrowRequestFailedExceptionWhenCheckGenerateReportIsDone() {
		String timeStamp = Long.toString(System.currentTimeMillis());
		String reportId = IdUtil.getPipelineReportId(timeStamp);

		when(asyncExceptionHandler.get(reportId)).thenReturn(new RequestFailedException(405, "RequestFailedException"));
		BaseException exception = assertThrows(RequestFailedException.class,
				() -> generateReporterService.getReportErrorAndHandleAsyncException(timeStamp));

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
			.csvTimeStamp(TIMESTAMP)
			.build();

		BadRequestException badRequestException = assertThrows(BadRequestException.class,
				() -> generateReporterService.generateReporter(request));
		assertEquals("Failed to fetch Jira info due to Jira board setting is null.", badRequestException.getMessage());
	}

	@Test
	void shouldThrowBadRequestExceptionGivenMetricsContainCodeBaseWhenCodeBaseSettingIsNull() {
		GenerateReportRequest request = GenerateReportRequest.builder()
			.considerHoliday(false)
			.metrics(List.of(RequireDataEnum.LEAD_TIME_FOR_CHANGES.getValue()))
			.codebaseSetting(null)
			.startTime("123")
			.endTime("123")
			.csvTimeStamp(TIMESTAMP)
			.build();

		BadRequestException badRequestException = assertThrows(BadRequestException.class,
				() -> generateReporterService.generateReporter(request));
		assertEquals("Failed to fetch Github info due to code base setting is null.", badRequestException.getMessage());
	}

	@Test
	void shouldThrowBadRequestExceptionGivenMetricsContainBuildKiteWhenBuildKiteSettingIsNull() {
		GenerateReportRequest request = GenerateReportRequest.builder()
			.considerHoliday(false)
			.metrics(List.of(RequireDataEnum.CHANGE_FAILURE_RATE.getValue()))
			.buildKiteSetting(null)
			.startTime("123")
			.endTime("123")
			.csvTimeStamp(TIMESTAMP)
			.build();

		BadRequestException badRequestException = assertThrows(BadRequestException.class,
				() -> generateReporterService.generateReporter(request));
		assertEquals("Failed to fetch BuildKite info due to BuildKite setting is null.",
				badRequestException.getMessage());
	}

	@Test
	void shouldInitializeValueFalseGivenPreviousMapperIsNullWhenInitializeRelatedMetricsCompleted() {
		String timeStamp = TIMESTAMP;
		List<String> metrics = List.of(RequireDataEnum.CYCLE_TIME.getValue());
		MetricsDataCompleted expectedPut = MetricsDataCompleted.builder()
			.boardMetricsCompleted(false)
			.pipelineMetricsCompleted(null)
			.sourceControlMetricsCompleted(null)
			.build();

		when(asyncReportRequestHandler.getMetricsDataCompleted(timeStamp)).thenReturn(null);

		generateReporterService.initializeMetricsDataCompletedInHandler(timeStamp, metrics);
		verify(asyncReportRequestHandler).putMetricsDataCompleted(timeStamp, expectedPut);
	}

	@Test
	void shouldInitializeValueFalseGivenPreviousValueExistWhenInitializeRelatedMetricsCompleted() {
		String timeStamp = TIMESTAMP;
		List<String> metrics = List.of(RequireDataEnum.CYCLE_TIME.getValue(),
				RequireDataEnum.DEPLOYMENT_FREQUENCY.getValue());
		MetricsDataCompleted previousMetricsDataCompleted = MetricsDataCompleted.builder()
			.boardMetricsCompleted(true)
			.pipelineMetricsCompleted(null)
			.sourceControlMetricsCompleted(null)
			.build();
		MetricsDataCompleted expectedPut = MetricsDataCompleted.builder()
			.boardMetricsCompleted(false)
			.pipelineMetricsCompleted(false)
			.sourceControlMetricsCompleted(null)
			.build();

		when(asyncReportRequestHandler.getMetricsDataCompleted(timeStamp)).thenReturn(previousMetricsDataCompleted);

		generateReporterService.initializeMetricsDataCompletedInHandler(timeStamp, metrics);
		verify(asyncReportRequestHandler).putMetricsDataCompleted(timeStamp, expectedPut);
	}

	@ParameterizedTest
	@MethodSource({ "provideDataForTest" })
	void shouldUpdateAndSetMetricsReadyNonnullTrueWhenMetricsExistAndPreviousMetricsReadyNotNull(List<String> metrics,
			MetricsDataCompleted previousReady, MetricsDataCompleted expectedReady) {
		GenerateReportRequest request = GenerateReportRequest.builder()
			.considerHoliday(false)
			.metrics(metrics)
			.jiraBoardSetting(buildJiraBoardSetting())
			.buildKiteSetting(buildPipelineSetting())
			.codebaseSetting(buildCodeBaseSetting())
			.startTime("123")
			.endTime("123")
			.csvTimeStamp(TIMESTAMP)
			.build();

		when(asyncReportRequestHandler.getMetricsDataCompleted(request.getCsvTimeStamp())).thenReturn(previousReady);

		generateReporterService.updateMetricsDataCompletedInHandler(request.getCsvTimeStamp(), request.getMetrics());

		verify(asyncReportRequestHandler, times(1)).putMetricsDataCompleted(request.getCsvTimeStamp(), expectedReady);
	}

	@Test
	void shouldNotUpdateMetricsAndThrowExceptionWhenPreviousMetricsDataReadyNull() {
		GenerateReportRequest request = GenerateReportRequest.builder()
			.considerHoliday(false)
			.metrics(List.of("velocity", "cycle time", "classification", "deployment frequency", "change failure rate",
					"mean time to recovery", "lead time for changes"))
			.jiraBoardSetting(buildJiraBoardSetting())
			.buildKiteSetting(buildPipelineSetting())
			.codebaseSetting(buildCodeBaseSetting())
			.startTime("123")
			.endTime("123")
			.csvTimeStamp(TIMESTAMP)
			.build();

		when(asyncReportRequestHandler.getMetricsDataCompleted(anyString())).thenReturn(null);

		assertThrows(GenerateReportException.class, () -> generateReporterService
			.updateMetricsDataCompletedInHandler(request.getCsvTimeStamp(), request.getMetrics()));

	}

	@Test
	void shouldReturnComposedReportResponseWhenBothBoardResponseAndDoraResponseReady() {
		ReportResponse boardResponse = ReportResponse.builder()
			.boardMetricsCompleted(true)
			.cycleTime(CycleTime.builder().averageCycleTimePerCard(20.0).build())
			.velocity(Velocity.builder().velocityForCards(10).build())
			.classificationList(List.of())
			.build();
		ReportResponse pipelineResponse = ReportResponse.builder()
			.pipelineMetricsCompleted(true)
			.changeFailureRate(ChangeFailureRate.builder()
				.avgChangeFailureRate(AvgChangeFailureRate.builder().name("name").failureRate(0.1f).build())
				.build())
			.deploymentFrequency(DeploymentFrequency.builder()
				.avgDeploymentFrequency(
						AvgDeploymentFrequency.builder().name("deploymentFrequency").deploymentFrequency(0.8f).build())
				.build())
			.meanTimeToRecovery(MeanTimeToRecovery.builder()
				.avgMeanTimeToRecovery(AvgMeanTimeToRecovery.builder().timeToRecovery(BigDecimal.TEN).build())
				.build())
			.build();

		String timeStamp = TIMESTAMP;
		String boardTimeStamp = "board-1683734399999";
		String pipelineTimestamp = "pipeline-1683734399999";

		when(generateReporterService.getReportFromHandler(boardTimeStamp)).thenReturn(boardResponse);
		when(generateReporterService.getReportFromHandler(pipelineTimestamp)).thenReturn(pipelineResponse);
		when(asyncReportRequestHandler.getMetricsDataCompleted(timeStamp))
			.thenReturn(new MetricsDataCompleted(Boolean.TRUE, Boolean.TRUE, null));

		ReportResponse composedResponse = generateReporterService.getComposedReportResponse(timeStamp, true);

		assertTrue(composedResponse.getAllMetricsCompleted());
		assertEquals(20.0, composedResponse.getCycleTime().getAverageCycleTimePerCard());
		assertEquals("deploymentFrequency",
				composedResponse.getDeploymentFrequency().getAvgDeploymentFrequency().getName());
		assertEquals(0.8f,
				composedResponse.getDeploymentFrequency().getAvgDeploymentFrequency().getDeploymentFrequency());
	}

	@Test
	void shouldReturnBoardReportResponseWhenDoraResponseIsNullAndGenerateReportIsOver() {
		ReportResponse boardResponse = ReportResponse.builder()
			.boardMetricsCompleted(true)
			.cycleTime(CycleTime.builder().averageCycleTimePerCard(20.0).build())
			.velocity(Velocity.builder().velocityForCards(10).build())
			.classificationList(List.of())
			.build();

		String timeStamp = TIMESTAMP;
		String boardTimeStamp = "board-1683734399999";
		String doraTimestamp = "dora-1683734399999";

		when(generateReporterService.getReportFromHandler(boardTimeStamp)).thenReturn(boardResponse);
		when(generateReporterService.getReportFromHandler(doraTimestamp)).thenReturn(null);
		when(asyncReportRequestHandler.getMetricsDataCompleted(timeStamp))
			.thenReturn(new MetricsDataCompleted(Boolean.TRUE, Boolean.TRUE, null));

		ReportResponse composedResponse = generateReporterService.getComposedReportResponse(timeStamp, true);

		assertTrue(composedResponse.getAllMetricsCompleted());
		assertTrue(composedResponse.getBoardMetricsCompleted());
		assertEquals(20.0, composedResponse.getCycleTime().getAverageCycleTimePerCard());
	}

	@Test
	void shouldDoConvertMetricDataToCSVWhenCallGenerateCSVForMetrics() throws IOException {
		String timeStamp = TIMESTAMP;
		ObjectMapper mapper = new ObjectMapper();
		ReportResponse reportResponse = mapper
			.readValue(new File("src/test/java/heartbeat/controller/report/reportResponse.json"), ReportResponse.class);
		doNothing().when(csvFileGenerator).convertMetricDataToCSV(any(), any());

		generateReporterService.generateCSVForMetric(reportResponse, timeStamp);

		verify(csvFileGenerator, times(1)).convertMetricDataToCSV(reportResponse, timeStamp);
	}

	@Test
	void shouldPutReportInHandlerWhenCallSaveReporterInHandler() throws IOException {
		String timeStamp = CSV_TIMESTAMP;
		String reportId = IdUtil.getPipelineReportId(timeStamp);
		ObjectMapper mapper = new ObjectMapper();
		ReportResponse reportResponse = mapper
			.readValue(new File("src/test/java/heartbeat/controller/report/reportResponse.json"), ReportResponse.class);
		doNothing().when(asyncReportRequestHandler).putReport(any(), any());

		generateReporterService.saveReporterInHandler(reportResponse, reportId);

		verify(asyncReportRequestHandler, times(1)).putReport(reportId, reportResponse);
	}

	@Test
	void shouldPutBoardReportIntoHandlerWhenCallGenerateBoardReport() throws IOException {
		ObjectMapper mapper = new ObjectMapper();
		GenerateReportRequest reportRequest = mapper.readValue(new File(REQUEST_FILE_PATH),
				GenerateReportRequest.class);
		ReportResponse reportResponse = mapper.readValue(new File(RESPONSE_FILE_PATH), ReportResponse.class);
		reportRequest.setCsvTimeStamp(CSV_TIMESTAMP);
		String reportId = "board-20240109232359";
		MetricsDataCompleted previousMetricsReady = MetricsDataCompleted.builder()
			.boardMetricsCompleted(true)
			.pipelineMetricsCompleted(false)
			.sourceControlMetricsCompleted(false)
			.build();
		GenerateReporterService spyGenerateReporterService = spy(generateReporterService);

		doReturn(reportResponse).when(spyGenerateReporterService).generateReporter(reportRequest);
		when(asyncReportRequestHandler.getMetricsDataCompleted(reportRequest.getCsvTimeStamp()))
			.thenReturn(previousMetricsReady);

		spyGenerateReporterService.generateBoardReport(reportRequest);

		verify(spyGenerateReporterService, times(1)).generateReporter(reportRequest);
		verify(asyncExceptionHandler, times(1)).remove(reportId);
		verify(spyGenerateReporterService, times(1))
			.initializeMetricsDataCompletedInHandler(reportRequest.getCsvTimeStamp(), reportRequest.getMetrics());
		verify(spyGenerateReporterService, times(1)).saveReporterInHandler(
				spyGenerateReporterService.generateReporter(reportRequest), reportRequest.getCsvTimeStamp());
		verify(spyGenerateReporterService, times(1))
			.updateMetricsDataCompletedInHandler(reportRequest.getCsvTimeStamp(), reportRequest.getMetrics());
	}

	@Test
	void shouldPutExceptionInHandlerWhenCallGenerateBoardReportThrowException() throws IOException {
		ObjectMapper mapper = new ObjectMapper();
		GenerateReportRequest reportRequest = mapper.readValue(new File(REQUEST_FILE_PATH),
				GenerateReportRequest.class);
		reportRequest.setCsvTimeStamp(CSV_TIMESTAMP);
		String reportId = "board-20240109232359";
		GenerateReporterService spyGenerateReporterService = spy(generateReporterService);
		UnauthorizedException e = new UnauthorizedException("Error message");

		doThrow(e).when(spyGenerateReporterService).generateReporter(any());
		when(asyncReportRequestHandler.getMetricsDataCompleted(reportRequest.getCsvTimeStamp()))
			.thenReturn(MetricsDataCompleted.builder().build());

		spyGenerateReporterService.generateBoardReport(reportRequest);

		verify(spyGenerateReporterService, times(1))
			.initializeMetricsDataCompletedInHandler(reportRequest.getCsvTimeStamp(), reportRequest.getMetrics());
		verify(spyGenerateReporterService, times(1))
			.saveReporterInHandler(spyGenerateReporterService.generateReporter(reportRequest), reportId);
		verify(asyncExceptionHandler, times(1)).put(reportId, e);
	}

	@Test
	void shouldPutExceptionInHandlerWhenCallGeneratePipelineReportThrowException() throws IOException {
		ObjectMapper mapper = new ObjectMapper();
		GenerateReportRequest reportRequest = mapper.readValue(new File(REQUEST_FILE_PATH),
				GenerateReportRequest.class);
		reportRequest.setCsvTimeStamp("20240109232359");
		reportRequest.setMetrics(List.of(RequireDataEnum.DEPLOYMENT_FREQUENCY.getValue()));
		String reportId = "pipeline-20240109232359";
		GenerateReporterService spyGenerateReporterService = spy(generateReporterService);
		PermissionDenyException e = new PermissionDenyException("Error message");

		doThrow(e).when(spyGenerateReporterService).generateReporter(any());
		when(asyncReportRequestHandler.getMetricsDataCompleted(reportRequest.getCsvTimeStamp()))
			.thenReturn(MetricsDataCompleted.builder().build());

		spyGenerateReporterService.generateDoraReport(reportRequest);

		verify(spyGenerateReporterService, times(1))
			.initializeMetricsDataCompletedInHandler(reportRequest.getCsvTimeStamp(), reportRequest.getMetrics());
		verify(spyGenerateReporterService, times(1))
			.saveReporterInHandler(spyGenerateReporterService.generateReporter(reportRequest), reportId);
		verify(asyncExceptionHandler, times(1)).put(reportId, e);
	}

	@Test
	void shouldGeneratePipelineReportAndUpdatePipelineMetricsReadyWhenCallGeneratePipelineReport() throws IOException {
		ObjectMapper mapper = new ObjectMapper();
		GenerateReportRequest reportRequest = mapper.readValue(new File(REQUEST_FILE_PATH),
				GenerateReportRequest.class);
		reportRequest.setMetrics(List.of("Deployment frequency"));
		ReportResponse reportResponse = mapper.readValue(new File(RESPONSE_FILE_PATH), ReportResponse.class);
		GenerateReporterService spyGenerateReporterService = spy(generateReporterService);
		reportRequest.setCsvTimeStamp(CSV_TIMESTAMP);
		String reportId = "pipeline-20240109232359";
		MetricsDataCompleted previousMetricsReady = MetricsDataCompleted.builder()
			.boardMetricsCompleted(null)
			.pipelineMetricsCompleted(false)
			.sourceControlMetricsCompleted(false)
			.build();

		doReturn(reportResponse).when(spyGenerateReporterService).generateReporter(reportRequest);
		when(asyncReportRequestHandler.getMetricsDataCompleted(reportRequest.getCsvTimeStamp()))
			.thenReturn(previousMetricsReady);

		spyGenerateReporterService.generateDoraReport(reportRequest);

		verify(spyGenerateReporterService, times(1)).generateReporter(any());
		verify(asyncExceptionHandler, times(1)).remove(reportId);
		verify(spyGenerateReporterService, times(1)).initializeMetricsDataCompletedInHandler(any(), any());
		verify(spyGenerateReporterService, times(1))
			.saveReporterInHandler(spyGenerateReporterService.generateReporter(any()), reportId);
		verify(spyGenerateReporterService, times(1)).updateMetricsDataCompletedInHandler(any(), any());
	}

	@Test
	void shouldGenerateCodebaseReportAndUpdateCodebaseMetricsReadyWhenCallGenerateSourceControlReport()
			throws IOException {
		ObjectMapper mapper = new ObjectMapper();
		GenerateReportRequest reportRequest = mapper.readValue(new File(REQUEST_FILE_PATH),
				GenerateReportRequest.class);
		reportRequest.setMetrics(List.of("Lead time for changes"));
		ReportResponse reportResponse = mapper.readValue(new File(RESPONSE_FILE_PATH), ReportResponse.class);
		GenerateReporterService spyGenerateReporterService = spy(generateReporterService);
		reportRequest.setCsvTimeStamp(CSV_TIMESTAMP);
		String reportId = "sourceControl-20240109232359";
		MetricsDataCompleted previousMetricsReady = MetricsDataCompleted.builder()
			.boardMetricsCompleted(null)
			.pipelineMetricsCompleted(false)
			.sourceControlMetricsCompleted(false)
			.build();

		doReturn(reportResponse).when(spyGenerateReporterService).generateReporter(reportRequest);
		when(asyncReportRequestHandler.getMetricsDataCompleted(reportRequest.getCsvTimeStamp()))
			.thenReturn(previousMetricsReady);

		spyGenerateReporterService.generateDoraReport(reportRequest);

		verify(spyGenerateReporterService, times(1)).generateReporter(any());
		verify(asyncExceptionHandler, times(1)).remove(reportId);
		verify(spyGenerateReporterService, times(1)).initializeMetricsDataCompletedInHandler(any(), any());
		verify(spyGenerateReporterService, times(1))
			.saveReporterInHandler(spyGenerateReporterService.generateReporter(any()), reportId);
		verify(spyGenerateReporterService, times(1)).updateMetricsDataCompletedInHandler(any(), any());

	}

	private JiraBoardSetting buildJiraBoardSetting() {
		return JiraBoardSetting.builder()
			.treatFlagCardAsBlock(true)
			.targetFields(BoardCsvFixture.MOCK_TARGET_FIELD_LIST())
			.build();
	}

	private BuildKiteSetting buildPipelineSetting() {
		DeploymentEnvironment mockDeployment = DeploymentEnvironmentBuilder.withDefault().build();
		mockDeployment.setRepository(GITHUB_REPOSITORY);
		return BuildKiteSetting.builder()
			.type(PipelineType.BUILDKITE.name())
			.token(BUILDKITE_TOKEN)
			.deploymentEnvList(List.of(mockDeployment))
			.build();
	}

	private CodebaseSetting buildCodeBaseSetting() {
		DeploymentEnvironment mockDeployment = DeploymentEnvironmentBuilder.withDefault().build();
		mockDeployment.setRepository(GITHUB_REPOSITORY);
		return CodebaseSetting.builder()
			.type(SourceType.GITHUB.name())
			.token(GITHUB_TOKEN)
			.leadTime(List.of(mockDeployment))
			.build();
	}

	private static Stream<Arguments> provideDataForTest() {
		return Stream.of(
				Arguments.of(List.of("velocity", "deployment frequency", "lead time for changes"),
						MetricsDataCompleted.builder()
							.boardMetricsCompleted(false)
							.pipelineMetricsCompleted(false)
							.sourceControlMetricsCompleted(null)
							.build(),
						MetricsDataCompleted.builder()
							.boardMetricsCompleted(true)
							.pipelineMetricsCompleted(true)
							.sourceControlMetricsCompleted(null)
							.build()),
				Arguments.of(List.of("velocity", "deployment frequency", "lead time for changes"),
						MetricsDataCompleted.builder()
							.boardMetricsCompleted(false)
							.pipelineMetricsCompleted(false)
							.sourceControlMetricsCompleted(false)
							.build(),
						MetricsDataCompleted.builder()
							.boardMetricsCompleted(true)
							.pipelineMetricsCompleted(true)
							.sourceControlMetricsCompleted(true)
							.build()),
				Arguments.of(List.of("velocity"),
						MetricsDataCompleted.builder()
							.boardMetricsCompleted(false)
							.pipelineMetricsCompleted(null)
							.sourceControlMetricsCompleted(null)
							.build(),
						MetricsDataCompleted.builder()
							.boardMetricsCompleted(true)
							.pipelineMetricsCompleted(null)
							.sourceControlMetricsCompleted(null)
							.build()),
				Arguments.of(List.of("deployment frequency", "change failure rate", "mean time to recovery"),
						MetricsDataCompleted.builder()
							.boardMetricsCompleted(null)
							.pipelineMetricsCompleted(false)
							.sourceControlMetricsCompleted(null)
							.build(),
						MetricsDataCompleted.builder()
							.boardMetricsCompleted(null)
							.pipelineMetricsCompleted(true)
							.sourceControlMetricsCompleted(null)
							.build()));
	}

}
