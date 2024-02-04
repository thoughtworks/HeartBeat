package heartbeat.service.report;

import com.fasterxml.jackson.databind.ObjectMapper;
import heartbeat.controller.board.dto.response.CardCollection;
import heartbeat.controller.report.dto.request.BuildKiteSetting;
import heartbeat.controller.report.dto.request.CodebaseSetting;
import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.request.JiraBoardSetting;
import heartbeat.controller.report.dto.request.MetricEnum;
import heartbeat.controller.report.dto.request.MetricType;
import heartbeat.controller.report.dto.response.ChangeFailureRate;
import heartbeat.controller.report.dto.response.Classification;
import heartbeat.controller.report.dto.response.CycleTime;
import heartbeat.controller.report.dto.response.DeploymentFrequency;
import heartbeat.controller.report.dto.response.LeadTimeForChanges;
import heartbeat.controller.report.dto.response.MeanTimeToRecovery;
import heartbeat.controller.report.dto.response.MetricsDataCompleted;
import heartbeat.controller.report.dto.response.PipelineCSVInfo;
import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.controller.report.dto.response.Velocity;
import heartbeat.exception.BadRequestException;
import heartbeat.exception.BaseException;
import heartbeat.exception.GenerateReportException;
import heartbeat.exception.NotFoundException;
import heartbeat.exception.ServiceUnavailableException;
import heartbeat.handler.AsyncExceptionHandler;
import heartbeat.handler.AsyncMetricsDataHandler;
import heartbeat.handler.AsyncReportRequestHandler;
import heartbeat.service.report.calculator.ChangeFailureRateCalculator;
import heartbeat.service.report.calculator.ClassificationCalculator;
import heartbeat.service.report.calculator.CycleTimeCalculator;
import heartbeat.service.report.calculator.DeploymentFrequencyCalculator;
import heartbeat.service.report.calculator.LeadTimeForChangesCalculator;
import heartbeat.service.report.calculator.MeanToRecoveryCalculator;
import heartbeat.service.report.calculator.VelocityCalculator;
import heartbeat.service.report.calculator.model.FetchedData;
import heartbeat.util.ValueUtil;
import lombok.val;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
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

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import static heartbeat.service.report.scheduler.DeleteExpireCSVScheduler.EXPORT_CSV_VALIDITY_TIME;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class GenerateReporterServiceTest {

	private static final String TIMESTAMP = "1683734399999";

	public static final String APP_OUTPUT_CSV_PATH = "./app/output/csv";

	@InjectMocks
	GenerateReporterService generateReporterService;

	@Mock
	WorkDay workDay;

	@Mock
	KanbanService kanbanService;

	@Mock
	PipelineService pipelineService;

	@Mock
	ClassificationCalculator classificationCalculator;

	@Mock
	DeploymentFrequencyCalculator deploymentFrequency;

	@Mock
	VelocityCalculator velocityCalculator;

	@Mock
	ChangeFailureRateCalculator changeFailureRate;

	@Mock
	MeanToRecoveryCalculator meanToRecoveryCalculator;

	@Mock
	CycleTimeCalculator cycleTimeCalculator;

	@Mock
	CSVFileGenerator csvFileGenerator;

	@Mock
	LeadTimeForChangesCalculator leadTimeForChangesCalculator;

	@Mock
	AsyncReportRequestHandler asyncReportRequestHandler;

	@Mock
	AsyncMetricsDataHandler asyncMetricsDataHandler;

	@Mock
	AsyncExceptionHandler asyncExceptionHandler;

	@Captor
	ArgumentCaptor<ReportResponse> responseArgumentCaptor;

	@Captor
	ArgumentCaptor<BaseException> exceptionCaptor;

	@AfterEach
	void afterEach() {
		new File(APP_OUTPUT_CSV_PATH).delete();
	}

	@AfterAll
	static void afterAll() {
		new File("./app/output").delete();
		new File("./app").delete();
	}

	@Nested
	class GenerateBoardReport {

		@Test
		void shouldSaveReportResponseWithoutMetricDataAndUpdateMetricCompletedWhenMetricsIsEmpty() {
			GenerateReportRequest request = GenerateReportRequest.builder()
				.considerHoliday(false)
				.metrics(List.of())
				.buildKiteSetting(BuildKiteSetting.builder().build())
				.csvTimeStamp(TIMESTAMP)
				.build();
			when(asyncMetricsDataHandler.getMetricsDataCompleted(any()))
				.thenReturn(MetricsDataCompleted.builder().build());
			doAnswer(invocation -> null).when(asyncMetricsDataHandler)
				.updateMetricsDataCompletedInHandler(TIMESTAMP, MetricType.BOARD);
			generateReporterService.generateBoardReport(request);

			verify(kanbanService, never()).fetchDataFromKanban(eq(request));
			verify(pipelineService, never()).fetchGithubData(any());
			verify(workDay).changeConsiderHolidayMode(false);
			verify(asyncReportRequestHandler).putReport(eq(request.getBoardReportId()),
					responseArgumentCaptor.capture());
			ReportResponse response = responseArgumentCaptor.getValue();
			assertEquals(1800000L, response.getExportValidityTime());
			assertNull(response.getCycleTime());
			assertNull(response.getVelocity());
			assertNull(response.getClassificationList());
			verify(asyncMetricsDataHandler).updateMetricsDataCompletedInHandler(eq(request.getCsvTimeStamp()), any());
		}

		@Test
		void shouldThrowErrorWhenGetMetricDataCompletedIsNull() {
			GenerateReportRequest request = GenerateReportRequest.builder()
				.considerHoliday(false)
				.metrics(List.of())
				.buildKiteSetting(BuildKiteSetting.builder().build())
				.csvTimeStamp(TIMESTAMP)
				.build();
			when(asyncMetricsDataHandler.getMetricsDataCompleted(any())).thenReturn(null);
			doAnswer(invocation -> null).when(asyncReportRequestHandler).putReport(any(), any());
			doThrow(new GenerateReportException("Failed to update metrics data completed through this timestamp."))
				.when(asyncMetricsDataHandler)
				.updateMetricsDataCompletedInHandler(TIMESTAMP, MetricType.BOARD);

			generateReporterService.generateBoardReport(request);

			verify(asyncExceptionHandler).remove(eq(request.getBoardReportId()));
			verify(asyncExceptionHandler).put(eq(request.getBoardReportId()), exceptionCaptor.capture());
			assertEquals("Failed to update metrics data completed through this timestamp.",
					exceptionCaptor.getValue().getMessage());
			assertEquals(500, exceptionCaptor.getValue().getStatus());
			verify(kanbanService, never()).fetchDataFromKanban(eq(request));
			verify(workDay).changeConsiderHolidayMode(false);
			verify(asyncReportRequestHandler).putReport(eq(request.getBoardReportId()),
					responseArgumentCaptor.capture());
			ReportResponse response = responseArgumentCaptor.getValue();
			assertEquals(1800000L, response.getExportValidityTime());
			assertNull(response.getCycleTime());
			verify(asyncMetricsDataHandler).updateMetricsDataCompletedInHandler(eq(request.getCsvTimeStamp()), any());
		}

		@Test
		void shouldThrowErrorWhenJiraBoardSettingIsNull() {
			GenerateReportRequest request = GenerateReportRequest.builder()
				.considerHoliday(false)
				.metrics(List.of("velocity"))
				.buildKiteSetting(BuildKiteSetting.builder().build())
				.csvTimeStamp(TIMESTAMP)
				.build();
			when(asyncMetricsDataHandler.getMetricsDataCompleted(any()))
				.thenReturn(MetricsDataCompleted.builder().build());
			doAnswer(invocation -> null).when(asyncMetricsDataHandler)
				.updateMetricsDataCompletedInHandler(TIMESTAMP, MetricType.BOARD);

			generateReporterService.generateBoardReport(request);

			verify(asyncExceptionHandler).put(eq(request.getBoardReportId()), exceptionCaptor.capture());
			assertEquals("Failed to fetch Jira info due to Jira board setting is null.",
					exceptionCaptor.getValue().getMessage());
			assertEquals(400, exceptionCaptor.getValue().getStatus());
			verify(kanbanService, never()).fetchDataFromKanban(eq(request));
			verify(workDay).changeConsiderHolidayMode(false);
			verify(asyncReportRequestHandler, never()).putReport(eq(request.getBoardReportId()), any());
			verify(asyncMetricsDataHandler, never()).updateMetricsDataCompletedInHandler(eq(request.getCsvTimeStamp()),
					any());
		}

		@Test
		void shouldSaveReportResponseWithVelocityAndUpdateMetricCompletedWhenVelocityMetricIsNotEmpty() {
			GenerateReportRequest request = GenerateReportRequest.builder()
				.considerHoliday(false)
				.metrics(List.of("velocity"))
				.buildKiteSetting(BuildKiteSetting.builder().build())
				.jiraBoardSetting(JiraBoardSetting.builder().build())
				.csvTimeStamp(TIMESTAMP)
				.build();
			when(asyncMetricsDataHandler.getMetricsDataCompleted(any()))
				.thenReturn(MetricsDataCompleted.builder().build());
			doAnswer(invocation -> null).when(asyncMetricsDataHandler)
				.updateMetricsDataCompletedInHandler(TIMESTAMP, MetricType.BOARD);
			when(velocityCalculator.calculateVelocity(any()))
				.thenReturn(Velocity.builder().velocityForSP(10).velocityForCards(20).build());
			when(kanbanService.fetchDataFromKanban(request)).thenReturn(FetchedData.CardCollectionInfo.builder()
				.realDoneCardCollection(CardCollection.builder().build())
				.build());

			generateReporterService.generateBoardReport(request);

			verify(asyncExceptionHandler).remove(request.getBoardReportId());
			verify(pipelineService, never()).fetchGithubData(any());
			verify(kanbanService).fetchDataFromKanban(eq(request));
			verify(workDay).changeConsiderHolidayMode(false);
			verify(asyncReportRequestHandler).putReport(eq(request.getBoardReportId()),
					responseArgumentCaptor.capture());
			ReportResponse response = responseArgumentCaptor.getValue();
			assertEquals(1800000L, response.getExportValidityTime());
			assertEquals(10, response.getVelocity().getVelocityForSP());
			assertEquals(20, response.getVelocity().getVelocityForCards());
			verify(asyncMetricsDataHandler).updateMetricsDataCompletedInHandler(eq(request.getCsvTimeStamp()), any());
		}

		@Test
		void shouldSaveReportResponseWithCycleTimeAndUpdateMetricCompletedWhenCycleTimeMetricIsNotEmpty() {
			GenerateReportRequest request = GenerateReportRequest.builder()
				.considerHoliday(false)
				.metrics(List.of("cycle time"))
				.buildKiteSetting(BuildKiteSetting.builder().build())
				.jiraBoardSetting(JiraBoardSetting.builder().build())
				.csvTimeStamp(TIMESTAMP)
				.build();
			when(asyncMetricsDataHandler.getMetricsDataCompleted(any()))
				.thenReturn(MetricsDataCompleted.builder().boardMetricsCompleted(true).build());
			doAnswer(invocation -> null).when(asyncMetricsDataHandler)
				.updateMetricsDataCompletedInHandler(TIMESTAMP, MetricType.BOARD);
			when(cycleTimeCalculator.calculateCycleTime(any(), any())).thenReturn(CycleTime.builder()
				.averageCycleTimePerSP(10)
				.totalTimeForCards(15)
				.averageCycleTimePerCard(20)
				.build());
			when(kanbanService.fetchDataFromKanban(request)).thenReturn(FetchedData.CardCollectionInfo.builder()
				.realDoneCardCollection(CardCollection.builder().build())
				.build());

			generateReporterService.generateBoardReport(request);

			verify(pipelineService, never()).fetchGithubData(any());
			verify(kanbanService).fetchDataFromKanban(eq(request));
			verify(workDay).changeConsiderHolidayMode(false);
			verify(asyncReportRequestHandler).putReport(eq(request.getBoardReportId()),
					responseArgumentCaptor.capture());
			ReportResponse response = responseArgumentCaptor.getValue();
			assertEquals(1800000L, response.getExportValidityTime());
			assertEquals(10, response.getCycleTime().getAverageCycleTimePerSP());
			assertEquals(20, response.getCycleTime().getAverageCycleTimePerCard());
			assertEquals(15, response.getCycleTime().getTotalTimeForCards());
			verify(asyncMetricsDataHandler).updateMetricsDataCompletedInHandler(eq(request.getCsvTimeStamp()), any());
		}

		@Test
		void shouldSaveReportResponseWithClassificationAndUpdateMetricCompletedWhenClassificationMetricIsNotEmpty() {
			GenerateReportRequest request = GenerateReportRequest.builder()
				.considerHoliday(false)
				.metrics(List.of("classification"))
				.buildKiteSetting(BuildKiteSetting.builder().build())
				.jiraBoardSetting(JiraBoardSetting.builder().build())
				.csvTimeStamp(TIMESTAMP)
				.build();
			when(asyncMetricsDataHandler.getMetricsDataCompleted(any()))
				.thenReturn(MetricsDataCompleted.builder().build());
			doAnswer(invocation -> null).when(asyncMetricsDataHandler)
				.updateMetricsDataCompletedInHandler(TIMESTAMP, MetricType.BOARD);
			List<Classification> classifications = List.of(Classification.builder().build());
			when(classificationCalculator.calculate(any(), any())).thenReturn(classifications);
			when(kanbanService.fetchDataFromKanban(request)).thenReturn(FetchedData.CardCollectionInfo.builder()
				.realDoneCardCollection(CardCollection.builder().build())
				.build());

			generateReporterService.generateBoardReport(request);

			verify(pipelineService, never()).fetchGithubData(any());
			verify(kanbanService).fetchDataFromKanban(eq(request));
			verify(workDay).changeConsiderHolidayMode(false);
			verify(asyncReportRequestHandler).putReport(eq(request.getBoardReportId()),
					responseArgumentCaptor.capture());
			ReportResponse response = responseArgumentCaptor.getValue();
			assertEquals(1800000L, response.getExportValidityTime());
			assertEquals(classifications, response.getClassificationList());
			verify(asyncMetricsDataHandler).updateMetricsDataCompletedInHandler(eq(request.getCsvTimeStamp()), any());
		}

		@Test
		void shouldUpdateMetricCompletedWhenExceptionStart4() {
			GenerateReportRequest request = GenerateReportRequest.builder()
				.considerHoliday(false)
				.metrics(List.of("classification"))
				.buildKiteSetting(BuildKiteSetting.builder().build())
				.jiraBoardSetting(JiraBoardSetting.builder().build())
				.csvTimeStamp(TIMESTAMP)
				.build();
			when(kanbanService.fetchDataFromKanban(request)).thenThrow(new NotFoundException(""));
			when(asyncMetricsDataHandler.getMetricsDataCompleted(any()))
				.thenReturn(MetricsDataCompleted.builder().build());
			doAnswer(invocation -> null).when(asyncMetricsDataHandler)
				.updateMetricsDataCompletedInHandler(TIMESTAMP, MetricType.BOARD);

			generateReporterService.generateBoardReport(request);

			verify(asyncExceptionHandler).put(eq(request.getBoardReportId()), any());
			verify(asyncMetricsDataHandler).updateMetricsDataCompletedInHandler(eq(request.getCsvTimeStamp()), any());
		}

	}

	@Nested
	class GenerateDoraReport {

		@Test
		void shouldGenerateCsvFile() {
			GenerateReportRequest request = GenerateReportRequest.builder()
				.considerHoliday(false)
				.metrics(List.of())
				.buildKiteSetting(BuildKiteSetting.builder().build())
				.csvTimeStamp(TIMESTAMP)
				.build();
			when(asyncMetricsDataHandler.getMetricsDataCompleted(any()))
				.thenReturn(MetricsDataCompleted.builder().build());
			doAnswer(invocation -> null).when(asyncMetricsDataHandler)
				.updateMetricsDataCompletedInHandler(TIMESTAMP, MetricType.DORA);
			List<PipelineCSVInfo> pipelineCSVInfos = List.of();
			when(pipelineService.generateCSVForPipelineWithCodebase(any(), any(), any(), any(), any()))
				.thenReturn(pipelineCSVInfos);

			generateReporterService.generateDoraReport(request);

			verify(asyncExceptionHandler).remove(request.getPipelineReportId());
			verify(asyncExceptionHandler).remove(request.getSourceControlReportId());
			verify(kanbanService, never()).fetchDataFromKanban(eq(request));
			verify(csvFileGenerator).convertPipelineDataToCSV(eq(pipelineCSVInfos), eq(request.getCsvTimeStamp()));
		}

		@Test
		void shouldThrowErrorWhenCodeSettingIsNullButSourceControlMetricsIsNotEmpty() {
			GenerateReportRequest request = GenerateReportRequest.builder()
				.considerHoliday(false)
				.metrics(List.of("lead time for changes"))
				.buildKiteSetting(BuildKiteSetting.builder().build())
				.csvTimeStamp(TIMESTAMP)
				.build();
			when(asyncMetricsDataHandler.getMetricsDataCompleted(any()))
				.thenReturn(MetricsDataCompleted.builder().build());
			doAnswer(invocation -> null).when(asyncMetricsDataHandler)
				.updateMetricsDataCompletedInHandler(TIMESTAMP, MetricType.DORA);
			List<PipelineCSVInfo> pipelineCSVInfos = List.of();
			when(pipelineService.generateCSVForPipelineWithCodebase(any(), any(), any(), any(), any()))
				.thenReturn(pipelineCSVInfos);

			try {
				generateReporterService.generateDoraReport(request);
				fail();
			}
			catch (BaseException e) {
				assertEquals(400, e.getStatus());
				assertEquals("Failed to fetch Github info due to code base setting is null.", e.getMessage());
			}

			verify(asyncExceptionHandler).remove(request.getPipelineReportId());
			verify(asyncExceptionHandler).remove(request.getSourceControlReportId());
			verify(kanbanService, never()).fetchDataFromKanban(eq(request));
			verify(csvFileGenerator, never()).convertPipelineDataToCSV(eq(pipelineCSVInfos),
					eq(request.getCsvTimeStamp()));
		}

		@Test
		void shouldThrowErrorWhenBuildKiteSettingIsNullButPipelineMetricsIsNotEmpty() {
			GenerateReportRequest request = GenerateReportRequest.builder()
				.metrics(List.of("deployment frequency"))
				.csvTimeStamp(TIMESTAMP)
				.build();
			when(asyncMetricsDataHandler.getMetricsDataCompleted(any()))
				.thenReturn(MetricsDataCompleted.builder().build());
			doAnswer(invocation -> null).when(asyncMetricsDataHandler)
				.updateMetricsDataCompletedInHandler(TIMESTAMP, MetricType.DORA);
			List<PipelineCSVInfo> pipelineCSVInfos = List.of();
			when(pipelineService.generateCSVForPipelineWithCodebase(any(), any(), any(), any(), any()))
				.thenReturn(pipelineCSVInfos);

			try {
				generateReporterService.generateDoraReport(request);
				fail();
			}
			catch (BaseException e) {
				assertEquals("Failed to fetch BuildKite info due to BuildKite setting is null.", e.getMessage());
				assertEquals(400, e.getStatus());
			}

			verify(asyncExceptionHandler).remove(request.getPipelineReportId());
			verify(asyncExceptionHandler).remove(request.getSourceControlReportId());
			verify(kanbanService, never()).fetchDataFromKanban(eq(request));
			verify(csvFileGenerator, never()).convertPipelineDataToCSV(eq(pipelineCSVInfos),
					eq(request.getCsvTimeStamp()));
		}

		@Test
		void shouldGenerateCsvWithPipelineReportWhenPipeLineMetricIsNotEmpty() {
			GenerateReportRequest request = GenerateReportRequest.builder()
				.considerHoliday(false)
				.startTime("10000")
				.endTime("20000")
				.metrics(List.of("deployment frequency", "change failure rate", "mean time to recovery"))
				.buildKiteSetting(BuildKiteSetting.builder().build())
				.csvTimeStamp(TIMESTAMP)
				.build();
			when(asyncMetricsDataHandler.getMetricsDataCompleted(any()))
				.thenReturn(MetricsDataCompleted.builder().build());
			doAnswer(invocation -> null).when(asyncMetricsDataHandler)
				.updateMetricsDataCompletedInHandler(TIMESTAMP, MetricType.DORA);
			List<PipelineCSVInfo> pipelineCSVInfos = List.of();
			when(pipelineService.generateCSVForPipelineWithCodebase(any(), any(), any(), any(), any()))
				.thenReturn(pipelineCSVInfos);
			when(pipelineService.fetchBuildKiteInfo(request))
				.thenReturn(FetchedData.BuildKiteData.builder().buildInfosList(List.of()).build());
			DeploymentFrequency fakeDeploymentFrequency = DeploymentFrequency.builder().build();
			ChangeFailureRate fakeChangeFailureRate = ChangeFailureRate.builder().build();
			MeanTimeToRecovery fakeMeantime = MeanTimeToRecovery.builder().build();
			when(deploymentFrequency.calculate(any(), any(), any())).thenReturn(fakeDeploymentFrequency);
			when(changeFailureRate.calculate(any())).thenReturn(fakeChangeFailureRate);
			when(meanToRecoveryCalculator.calculate(any())).thenReturn(fakeMeantime);

			generateReporterService.generateDoraReport(request);

			verify(workDay).changeConsiderHolidayMode(false);
			verify(asyncReportRequestHandler).putReport(eq(request.getPipelineReportId()),
					responseArgumentCaptor.capture());

			ReportResponse response = responseArgumentCaptor.getValue();

			assertEquals(1800000L, response.getExportValidityTime());
			assertEquals(fakeChangeFailureRate, response.getChangeFailureRate());
			assertEquals(fakeMeantime, response.getMeanTimeToRecovery());
			assertEquals(fakeChangeFailureRate, response.getChangeFailureRate());
			assertEquals(fakeDeploymentFrequency, response.getDeploymentFrequency());

			verify(csvFileGenerator).convertPipelineDataToCSV(eq(pipelineCSVInfos), eq(request.getCsvTimeStamp()));
		}

		@Test
		void shouldUpdateMetricCompletedWhenGenerateCsvWithPipelineReportFailed() {
			GenerateReportRequest request = GenerateReportRequest.builder()
				.considerHoliday(false)
				.startTime("10000")
				.endTime("20000")
				.metrics(List.of("change failure rate"))
				.buildKiteSetting(BuildKiteSetting.builder().build())
				.csvTimeStamp(TIMESTAMP)
				.build();
			when(asyncMetricsDataHandler.getMetricsDataCompleted(any()))
				.thenReturn(MetricsDataCompleted.builder().build());
			doAnswer(invocation -> null).when(asyncMetricsDataHandler)
				.updateMetricsDataCompletedInHandler(TIMESTAMP, MetricType.DORA);
			List<PipelineCSVInfo> pipelineCSVInfos = List.of();
			when(pipelineService.generateCSVForPipelineWithCodebase(any(), any(), any(), any(), any()))
				.thenReturn(pipelineCSVInfos);
			when(pipelineService.fetchBuildKiteInfo(request))
				.thenReturn(FetchedData.BuildKiteData.builder().buildInfosList(List.of()).build());
			when(changeFailureRate.calculate(any())).thenThrow(new NotFoundException(""));

			generateReporterService.generateDoraReport(request);

			verify(asyncExceptionHandler).put(eq(request.getPipelineReportId()), any());
			verify(asyncMetricsDataHandler, times(2)).updateMetricsDataCompletedInHandler(eq(request.getCsvTimeStamp()),
					any());
		}

		@Test
		void shouldGenerateCsvWithSourceControlReportWhenSourceControlMetricIsNotEmpty() {
			GenerateReportRequest request = GenerateReportRequest.builder()
				.considerHoliday(false)
				.startTime("10000")
				.endTime("20000")
				.metrics(List.of("lead time for changes"))
				.codebaseSetting(CodebaseSetting.builder().build())
				.buildKiteSetting(BuildKiteSetting.builder().build())
				.csvTimeStamp(TIMESTAMP)
				.build();
			when(asyncMetricsDataHandler.getMetricsDataCompleted(any()))
				.thenReturn(MetricsDataCompleted.builder().build());
			doAnswer(invocation -> null).when(asyncMetricsDataHandler)
				.updateMetricsDataCompletedInHandler(TIMESTAMP, MetricType.DORA);
			List<PipelineCSVInfo> pipelineCSVInfos = List.of();
			when(pipelineService.generateCSVForPipelineWithCodebase(any(), any(), any(), any(), any()))
				.thenReturn(pipelineCSVInfos);
			when(pipelineService.fetchGithubData(request))
				.thenReturn(FetchedData.BuildKiteData.builder().buildInfosList(List.of()).build());
			LeadTimeForChanges fakeLeadTimeForChange = LeadTimeForChanges.builder().build();
			when(leadTimeForChangesCalculator.calculate(any())).thenReturn(fakeLeadTimeForChange);

			generateReporterService.generateDoraReport(request);

			verify(workDay).changeConsiderHolidayMode(false);
			verify(asyncReportRequestHandler).putReport(eq(request.getSourceControlReportId()),
					responseArgumentCaptor.capture());
			ReportResponse response = responseArgumentCaptor.getValue();
			assertEquals(1800000L, response.getExportValidityTime());
			assertEquals(fakeLeadTimeForChange, response.getLeadTimeForChanges());
			verify(csvFileGenerator).convertPipelineDataToCSV(eq(pipelineCSVInfos), eq(request.getCsvTimeStamp()));
		}

		@Test
		void shouldGenerateCsvWithCachedDataWhenBuildKiteDataAlreadyExisted() {
			GenerateReportRequest request = GenerateReportRequest.builder()
				.considerHoliday(false)
				.startTime("10000")
				.endTime("20000")
				.metrics(
						List.of(MetricEnum.LEAD_TIME_FOR_CHANGES.getValue(), MetricEnum.CHANGE_FAILURE_RATE.getValue()))
				.codebaseSetting(CodebaseSetting.builder().build())
				.buildKiteSetting(BuildKiteSetting.builder().build())
				.csvTimeStamp(TIMESTAMP)
				.build();
			when(asyncMetricsDataHandler.getMetricsDataCompleted(any()))
				.thenReturn(MetricsDataCompleted.builder().build());
			doAnswer(invocation -> null).when(asyncMetricsDataHandler)
				.updateMetricsDataCompletedInHandler(TIMESTAMP, MetricType.DORA);
			List<PipelineCSVInfo> pipelineCSVInfos = List.of();
			when(pipelineService.generateCSVForPipelineWithCodebase(any(), any(), any(), any(), any()))
				.thenReturn(pipelineCSVInfos);
			when(pipelineService.fetchGithubData(any()))
				.thenReturn(FetchedData.BuildKiteData.builder().buildInfosList(List.of()).build());
			when(pipelineService.fetchBuildKiteInfo(any()))
				.thenReturn(FetchedData.BuildKiteData.builder().buildInfosList(List.of()).build());
			LeadTimeForChanges fakeLeadTimeForChange = LeadTimeForChanges.builder().build();
			when(leadTimeForChangesCalculator.calculate(any())).thenReturn(fakeLeadTimeForChange);

			generateReporterService.generateDoraReport(request);

			verify(workDay, times(2)).changeConsiderHolidayMode(false);
			verify(asyncReportRequestHandler).putReport(eq(request.getSourceControlReportId()),
					responseArgumentCaptor.capture());
			ReportResponse response = responseArgumentCaptor.getValue();
			assertEquals(1800000L, response.getExportValidityTime());
			assertEquals(fakeLeadTimeForChange, response.getLeadTimeForChanges());
			verify(csvFileGenerator).convertPipelineDataToCSV(eq(pipelineCSVInfos), eq(request.getCsvTimeStamp()));
		}

		@Test
		void shouldUpdateMetricCompletedWhenGenerateCsvWithSourceControlReportFailed() {
			GenerateReportRequest request = GenerateReportRequest.builder()
				.considerHoliday(false)
				.startTime("10000")
				.endTime("20000")
				.metrics(List.of(MetricEnum.LEAD_TIME_FOR_CHANGES.getValue()))
				.codebaseSetting(CodebaseSetting.builder().build())
				.buildKiteSetting(BuildKiteSetting.builder().build())
				.csvTimeStamp(TIMESTAMP)
				.build();
			when(asyncMetricsDataHandler.getMetricsDataCompleted(any()))
				.thenReturn(MetricsDataCompleted.builder().build());
			doAnswer(invocation -> null).when(asyncMetricsDataHandler)
				.updateMetricsDataCompletedInHandler(TIMESTAMP, MetricType.DORA);
			List<PipelineCSVInfo> pipelineCSVInfos = List.of();
			when(pipelineService.generateCSVForPipelineWithCodebase(any(), any(), any(), any(), any()))
				.thenReturn(pipelineCSVInfos);
			when(pipelineService.fetchGithubData(request)).thenReturn(
					FetchedData.BuildKiteData.builder().pipelineLeadTimes(List.of()).buildInfosList(List.of()).build());
			doThrow(new NotFoundException("")).when(leadTimeForChangesCalculator).calculate(any());

			generateReporterService.generateDoraReport(request);

			verify(asyncExceptionHandler).put(eq(request.getSourceControlReportId()), any());
			verify(asyncMetricsDataHandler, times(2)).updateMetricsDataCompletedInHandler(eq(request.getCsvTimeStamp()),
					any());
		}

	}

	@Nested
	class GenerateCSVForMetric {

		@Test
		void shouldCallCsvFileGenerator() {
			ReportResponse response = ReportResponse.builder().build();
			generateReporterService.generateCSVForMetric(response, "timestamp");

			verify(csvFileGenerator).convertMetricDataToCSV(eq(response), eq("timestamp"));
		}

	}

	@Nested
	class CheckReportReadyStatus {

		@Test
		void shouldThrowErrorWhenTimeStampIsInvalid() {
			try {
				generateReporterService.checkReportReadyStatus(
						String.valueOf(System.currentTimeMillis() - EXPORT_CSV_VALIDITY_TIME - 200));
				fail();
			}
			catch (BaseException e) {
				assertEquals("Failed to get report due to report time expires", e.getMessage());
				assertEquals(500, e.getStatus());
			}
		}

		@Test
		void shouldReturnMetricStatus() {
			String timeStamp = String.valueOf(System.currentTimeMillis() - EXPORT_CSV_VALIDITY_TIME + 200);
			MetricsDataDTO metricsDataDTO = new MetricsDataDTO(true, true, true);
			when(asyncMetricsDataHandler.getReportReadyStatusByTimeStamp(timeStamp)).thenReturn(metricsDataDTO);

			MetricsDataDTO readyStatus = generateReporterService.checkReportReadyStatus(timeStamp);

			assertEquals(metricsDataDTO, readyStatus);
		}

	}

	@Nested
	class GetComposedReportResponse {

		String reportId = String.valueOf(System.currentTimeMillis() - EXPORT_CSV_VALIDITY_TIME + 200);

		MetricsDataDTO metricsDataDTO = new MetricsDataDTO(false, true, false);

		@Test
		void shouldGetDataFromCache() {
			when(asyncReportRequestHandler.getReport(any())).thenReturn(ReportResponse.builder().build());
			when(asyncMetricsDataHandler.getReportReadyStatusByTimeStamp(reportId))
				.thenReturn(metricsDataDTO);
			when(asyncExceptionHandler.get(any())).thenReturn(null);

			ReportResponse res = generateReporterService.getComposedReportResponse(reportId);

			assertEquals(EXPORT_CSV_VALIDITY_TIME, res.getExportValidityTime());
			assertEquals(false, res.isBoardMetricsCompleted());
			assertEquals(true, res.isDoraMetricsCompleted());
			assertEquals(false, res.isAllMetricsCompleted());
			assertNull(res.getReportMetricsError().getBoardMetricsError());
		}

		@Test
		void shouldReturnErrorDataWhenExceptionIs404Or403Or401() {
			when(asyncReportRequestHandler.getReport(any())).thenReturn(ReportResponse.builder().build());
			when(asyncMetricsDataHandler.getReportReadyStatusByTimeStamp(reportId))
				.thenReturn(metricsDataDTO);
			when(asyncExceptionHandler.get(any())).thenReturn(new NotFoundException("error"));

			ReportResponse res = generateReporterService.getComposedReportResponse(reportId);

			assertEquals(EXPORT_CSV_VALIDITY_TIME, res.getExportValidityTime());
			assertEquals(false, res.isAllMetricsCompleted());
			assertEquals(404, res.getReportMetricsError().getBoardMetricsError().getStatus());
		}

		@Test
		void shouldThrowGenerateReportExceptionWhenErrorIs500() {
			when(asyncReportRequestHandler.getReport(any())).thenReturn(ReportResponse.builder().build());
			when(asyncMetricsDataHandler.getReportReadyStatusByTimeStamp(reportId))
				.thenReturn(metricsDataDTO);
			when(asyncExceptionHandler.get(any())).thenReturn(new GenerateReportException("errorMessage"));

			try {
				generateReporterService.getComposedReportResponse(reportId);
				fail();
			}
			catch (BaseException e) {
				assertEquals("errorMessage", e.getMessage());
				assertEquals(500, e.getStatus());
			}
		}

		@Test
		void shouldThrowServiceUnavailableExceptionWhenErrorIs503() {
			when(asyncReportRequestHandler.getReport(any())).thenReturn(ReportResponse.builder().build());
			when(asyncMetricsDataHandler.getReportReadyStatusByTimeStamp(reportId))
				.thenReturn(metricsDataDTO);
			when(asyncExceptionHandler.get(any())).thenReturn(new ServiceUnavailableException("errorMessage"));

			try {
				generateReporterService.getComposedReportResponse(reportId);
				fail();
			}
			catch (BaseException e) {
				assertEquals("errorMessage", e.getMessage());
				assertEquals(503, e.getStatus());
			}
		}

		@Test
		void shouldThrowRequestFailedExceptionWhenErrorIsDefault() {
			when(asyncReportRequestHandler.getReport(any())).thenReturn(ReportResponse.builder().build());
			when(asyncMetricsDataHandler.getReportReadyStatusByTimeStamp(reportId))
				.thenReturn(metricsDataDTO);
			when(asyncExceptionHandler.get(any())).thenReturn(new BadRequestException("error"));

			try {
				generateReporterService.getComposedReportResponse(reportId);
				fail();
			}
			catch (BaseException e) {
				assertEquals("Request failed with status statusCode 400, error: error", e.getMessage());
				assertEquals(400, e.getStatus());
			}
		}

	}

	@Nested
	class DeleteExpireCSV {

		@Test
		void shouldNotDeleteOldCsvWhenExportCsvWithoutOldCsvInsideThirtyMinutes() throws IOException {
			Files.createDirectories(Path.of(APP_OUTPUT_CSV_PATH));
			long currentTimeStamp = System.currentTimeMillis();
			Path csvFilePath = Path
				.of(String.format(APP_OUTPUT_CSV_PATH + "exportPipelineMetrics-%s.csv", currentTimeStamp));
			Files.createFile(csvFilePath);

			generateReporterService.deleteExpireCSV(currentTimeStamp - 800000, new File(APP_OUTPUT_CSV_PATH));

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

		@Test
		void shouldDeleteFailWhenDeleteFile() {
			File mockFile = mock(File.class);
			when(mockFile.getName()).thenReturn("board-1683734399999");
			when(mockFile.delete()).thenReturn(false);
			when(mockFile.exists()).thenReturn(true);
			File[] mockFiles = new File[] { mockFile };
			File directory = mock(File.class);
			when(directory.listFiles()).thenReturn(mockFiles);

			Boolean deleteStatus = generateReporterService.deleteExpireCSV(System.currentTimeMillis(), directory);

			assertTrue(deleteStatus);
		}

		@Test
		void shouldDoConvertMetricDataToCSVWhenCallGenerateCSVForMetrics() throws IOException {
			String timeStamp = TIMESTAMP;
			ObjectMapper mapper = new ObjectMapper();
			ReportResponse reportResponse = mapper.readValue(
					new File("src/test/java/heartbeat/controller/report/reportResponse.json"), ReportResponse.class);
			doNothing().when(csvFileGenerator).convertMetricDataToCSV(any(), any());

			generateReporterService.generateCSVForMetric(reportResponse, timeStamp);

			verify(csvFileGenerator, times(1)).convertMetricDataToCSV(reportResponse, timeStamp);
		}

	}

}
