package heartbeat.service.report;

import heartbeat.client.dto.board.jira.Assignee;
import heartbeat.client.dto.board.jira.JiraCard;
import heartbeat.client.dto.board.jira.JiraCardField;
import heartbeat.controller.board.dto.request.RequestJiraBoardColumnSetting;
import heartbeat.controller.board.dto.response.CardCollection;
import heartbeat.controller.board.dto.response.JiraCardDTO;
import heartbeat.controller.board.dto.response.TargetField;
import heartbeat.controller.pipeline.dto.request.DeploymentEnvironment;
import heartbeat.controller.report.dto.request.BuildKiteSetting;
import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.request.JiraBoardSetting;
import heartbeat.controller.report.dto.response.AvgChangeFailureRate;
import heartbeat.controller.report.dto.response.AvgDeploymentFrequency;
import heartbeat.controller.report.dto.response.ChangeFailureRate;
import heartbeat.controller.report.dto.response.Classification;
import heartbeat.controller.report.dto.response.ClassificationNameValuePair;
import heartbeat.controller.report.dto.response.CycleTime;
import heartbeat.controller.report.dto.response.DeploymentFrequency;
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
import heartbeat.service.report.calculator.CycleTimeCalculator;
import heartbeat.service.report.calculator.DeploymentFrequencyCalculator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.List;

import static heartbeat.service.report.CycleTimeFixture.JIRA_BOARD_COLUMNS_SETTING;
import static heartbeat.service.report.CycleTimeFixture.MOCK_CARD_COLLECTION;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class GenerateReporterServiceTest {

	@InjectMocks
	GenerateReporterService generateReporterService;

	@Mock
	JiraService jiraService;

	@Mock
	ClassificationCalculator classificationCalculator;

	@Mock
	private BuildKiteService buildKiteService;

	@Mock
	private DeploymentFrequencyCalculator calculateDeploymentFrequency;

	@Mock
	private ChangeFailureRateCalculator calculateChangeFailureRate;

	@Mock
	private CycleTimeCalculator cycleTimeCalculator;

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
			.metrics(List.of("velocity"))
			.jiraBoardSetting(jiraBoardSetting)
			.startTime("123")
			.endTime("123")
			.jiraBoardSetting(JiraBoardSetting.builder().treatFlagCardAsBlock(true).build())
			.build();

		when(jiraService.getStoryPointsAndCycleTime(any(), any(), any()))
			.thenReturn(CardCollection.builder().storyPointSum(0).cardsNumber(0).build());

		ReportResponse result = generateReporterService.generateReporter(request);
		Velocity velocity = Velocity.builder().velocityForSP(0).velocityForCards(0).build();

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
			.token("bkua_6xxxafcc3bxxxxxxb8xxx8d8dxxxf7897cc8b2f1")
			.deploymentEnvList(List.of(mockDeployment))
			.build();

		GenerateReportRequest request = GenerateReportRequest.builder()
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
			.token("bkua_6xxxafcc3bxxxxxxb8xxx8d8dxxxf7897cc8b2f1")
			.deploymentEnvList(List.of(mockDeployment))
			.build();
		GenerateReportRequest request = GenerateReportRequest.builder()
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

}
