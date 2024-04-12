package heartbeat.service.report;

import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.request.ReportType;
import heartbeat.controller.report.dto.response.ErrorInfo;
import heartbeat.controller.report.dto.response.MetricsDataCompleted;
import heartbeat.controller.report.dto.response.ReportMetricsError;
import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.exception.NotFoundException;
import heartbeat.handler.AsyncMetricsDataHandler;
import heartbeat.service.report.calculator.ReportGenerator;
import heartbeat.util.IdUtil;
import org.awaitility.Awaitility;
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
import org.springframework.core.io.InputStreamResource;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import static heartbeat.controller.report.dto.request.MetricType.BOARD;
import static heartbeat.controller.report.dto.request.MetricType.DORA;
import static heartbeat.service.report.scheduler.DeleteExpireCSVScheduler.EXPORT_CSV_VALIDITY_TIME;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.STRICT_STUBS)
public class ReportServiceTest {

	@InjectMocks
	ReportService reportService;

	@Mock
	CSVFileGenerator csvFileGenerator;

	@Mock
	AsyncMetricsDataHandler asyncMetricsDataHandler;

	@Mock
	GenerateReporterService generateReporterService;

	@Mock
	ReportGenerator reportGenerator;

	@Captor
	ArgumentCaptor<MetricsDataCompleted> metricsDataCompletedArgumentCaptor;

	@Test
	void exportCsvShouldCallCsvFileGeneratorToGotTheStreamWhenTimestampIsValid() throws IOException {
		long validTimestamp = System.currentTimeMillis() - EXPORT_CSV_VALIDITY_TIME + 20000L;
		when(csvFileGenerator.getDataFromCSV(ReportType.METRIC, validTimestamp))
			.thenReturn(new InputStreamResource(new ByteArrayInputStream("csv data".getBytes())));

		InputStream result = reportService.exportCsv(ReportType.METRIC, validTimestamp).getInputStream();
		String returnData = new BufferedReader(new InputStreamReader(result)).lines().collect(Collectors.joining("\n"));

		assertEquals(returnData, "csv data");
		verify(csvFileGenerator).getDataFromCSV(ReportType.METRIC, validTimestamp);
	}

	@Test
	void exportCsvShouldThrowNotFoundExceptionWhenTimestampIsValid() {
		long invalidTimestamp = System.currentTimeMillis() - EXPORT_CSV_VALIDITY_TIME - 20000L;

		assertThrows(NotFoundException.class, () -> reportService.exportCsv(ReportType.METRIC, invalidTimestamp));
		verify(csvFileGenerator, never()).getDataFromCSV(ReportType.METRIC, invalidTimestamp);
	}

	@Nested
	class GenerateReportByType {

		String timeStamp = "1683734399999";

		GenerateReportRequest request = GenerateReportRequest.builder()
			.csvTimeStamp(timeStamp)
			.metrics(new ArrayList<>())
			.metricTypes(List.of(BOARD))
			.build();

		@Test
		void shouldSuccessfulGenerateBoardReportAndInitializeMetricDataWhenMetricTypesListOnlyHasBoardElement() {
			MetricsDataCompleted expected = MetricsDataCompleted.builder()
				.boardMetricsCompleted(false)
				.overallMetricCompleted(false)
				.isSuccessfulCreateCsvFile(false)
				.build();
			doAnswer(invocation -> null).when(asyncMetricsDataHandler).putMetricsDataCompleted(any(), any());
			doAnswer(invocation -> null).when(generateReporterService).generateBoardReport(request);
			when(generateReporterService.getComposedReportResponse(any()))
				.thenReturn(ReportResponse.builder().reportMetricsError(ReportMetricsError.builder().build()).build());
			when(reportGenerator.getReportGenerator(generateReporterService)).thenReturn(Map.of(BOARD,
					generateReporterService::generateBoardReport, DORA, generateReporterService::generateDoraReport));

			reportService.generateReport(request);

			verify(asyncMetricsDataHandler).putMetricsDataCompleted(any(),
					metricsDataCompletedArgumentCaptor.capture());
			MetricsDataCompleted metricsDataCompleted = metricsDataCompletedArgumentCaptor.getValue();
			assertEquals(metricsDataCompleted, expected);
			Awaitility.await().atMost(5, TimeUnit.SECONDS).untilAsserted(() -> {
				verify(generateReporterService).generateBoardReport(request);
				verify(generateReporterService, never()).generateDoraReport(request);
				verify(generateReporterService).getComposedReportResponse(request.getCsvTimeStamp());
				verify(asyncMetricsDataHandler)
					.updateOverallMetricsCompletedInHandler(IdUtil.getDataCompletedPrefix(request.getCsvTimeStamp()));
			});
		}

		@Test
		void shouldSuccessfulGenerateDoraReportWhenMetricTypesListOnlyHasDoraMetricType() {
			MetricsDataCompleted expected = MetricsDataCompleted.builder()
				.doraMetricsCompleted(false)
				.overallMetricCompleted(false)
				.isSuccessfulCreateCsvFile(false)
				.build();
			doAnswer(invocation -> null).when(asyncMetricsDataHandler).putMetricsDataCompleted(any(), any());
			request.setMetricTypes(List.of(DORA));
			doAnswer(invocation -> null).when(generateReporterService).generateDoraReport(request);
			when(generateReporterService.getComposedReportResponse(any()))
				.thenReturn(ReportResponse.builder().reportMetricsError(ReportMetricsError.builder().build()).build());
			when(reportGenerator.getReportGenerator(generateReporterService)).thenReturn(Map.of(BOARD,
					generateReporterService::generateBoardReport, DORA, generateReporterService::generateDoraReport));

			reportService.generateReport(request);

			verify(asyncMetricsDataHandler).putMetricsDataCompleted(any(),
					metricsDataCompletedArgumentCaptor.capture());
			MetricsDataCompleted metricsDataCompleted = metricsDataCompletedArgumentCaptor.getValue();
			assertEquals(metricsDataCompleted, expected);
			Awaitility.await().atMost(5, TimeUnit.SECONDS).untilAsserted(() -> {
				verify(generateReporterService).generateDoraReport(request);
				verify(generateReporterService, never()).generateBoardReport(request);
				verify(generateReporterService).getComposedReportResponse(request.getCsvTimeStamp());
				verify(asyncMetricsDataHandler)
					.updateOverallMetricsCompletedInHandler(IdUtil.getDataCompletedPrefix(request.getCsvTimeStamp()));
			});
		}

		@Test
		void shouldSuccessfulGenerateDoraReportAndBoardReportGivenMetricTypesListHasDoraMetricTypeAndBoardMetricType() {
			MetricsDataCompleted expected = MetricsDataCompleted.builder()
				.boardMetricsCompleted(false)
				.doraMetricsCompleted(false)
				.overallMetricCompleted(false)
				.isSuccessfulCreateCsvFile(false)
				.build();
			doAnswer(invocation -> null).when(asyncMetricsDataHandler).putMetricsDataCompleted(any(), any());
			request.setMetricTypes(List.of(BOARD, DORA));
			doAnswer(invocation -> null).when(generateReporterService).generateDoraReport(request);
			doAnswer(invocation -> null).when(generateReporterService).generateBoardReport(request);
			when(generateReporterService.getComposedReportResponse(any()))
				.thenReturn(ReportResponse.builder().reportMetricsError(ReportMetricsError.builder().build()).build());
			when(reportGenerator.getReportGenerator(generateReporterService)).thenReturn(Map.of(BOARD,
					generateReporterService::generateBoardReport, DORA, generateReporterService::generateDoraReport));

			reportService.generateReport(request);

			verify(asyncMetricsDataHandler).putMetricsDataCompleted(any(),
					metricsDataCompletedArgumentCaptor.capture());
			MetricsDataCompleted metricsDataCompleted = metricsDataCompletedArgumentCaptor.getValue();
			assertEquals(metricsDataCompleted, expected);
			Awaitility.await().atMost(5, TimeUnit.SECONDS).untilAsserted(() -> {
				verify(generateReporterService).generateDoraReport(request);
				verify(generateReporterService).generateBoardReport(request);
				verify(generateReporterService).getComposedReportResponse(request.getCsvTimeStamp());
				verify(asyncMetricsDataHandler)
					.updateOverallMetricsCompletedInHandler(IdUtil.getDataCompletedPrefix(request.getCsvTimeStamp()));
			});
		}

		@Test
		void shouldNotGenerateMetricCsvWhenBoardMetricsHasError() {
			MetricsDataCompleted expected = MetricsDataCompleted.builder()
				.boardMetricsCompleted(false)
				.doraMetricsCompleted(false)
				.overallMetricCompleted(false)
				.isSuccessfulCreateCsvFile(false)
				.build();
			doAnswer(invocation -> null).when(asyncMetricsDataHandler).putMetricsDataCompleted(any(), any());
			request.setMetricTypes(List.of(BOARD, DORA));
			doAnswer(invocation -> null).when(generateReporterService).generateDoraReport(request);
			doAnswer(invocation -> null).when(generateReporterService).generateBoardReport(request);
			when(generateReporterService.getComposedReportResponse(any())).thenReturn(ReportResponse.builder()
				.reportMetricsError(ReportMetricsError.builder().boardMetricsError(ErrorInfo.builder().build()).build())
				.build());
			when(reportGenerator.getReportGenerator(generateReporterService)).thenReturn(Map.of(BOARD,
					generateReporterService::generateBoardReport, DORA, generateReporterService::generateDoraReport));

			reportService.generateReport(request);

			verify(asyncMetricsDataHandler).putMetricsDataCompleted(any(),
					metricsDataCompletedArgumentCaptor.capture());
			MetricsDataCompleted metricsDataCompleted = metricsDataCompletedArgumentCaptor.getValue();
			assertEquals(metricsDataCompleted, expected);
			Awaitility.await().atMost(5, TimeUnit.SECONDS).untilAsserted(() -> {
				verify(generateReporterService).generateDoraReport(request);
				verify(generateReporterService).generateBoardReport(request);
				verify(generateReporterService).getComposedReportResponse(request.getCsvTimeStamp());
				verify(generateReporterService, never()).generateCSVForMetric(any(), any());
				verify(asyncMetricsDataHandler, times(1))
					.updateOverallMetricsCompletedInHandler(IdUtil.getDataCompletedPrefix(request.getCsvTimeStamp()));
			});
		}

		@Test
		void shouldNotGenerateMetricCsvWhenPiplineMetricsErrorHasError() {
			MetricsDataCompleted expected = MetricsDataCompleted.builder()
				.boardMetricsCompleted(false)
				.doraMetricsCompleted(false)
				.overallMetricCompleted(false)
				.isSuccessfulCreateCsvFile(false)
				.build();
			doAnswer(invocation -> null).when(asyncMetricsDataHandler).putMetricsDataCompleted(any(), any());
			request.setMetricTypes(List.of(BOARD, DORA));
			doAnswer(invocation -> null).when(generateReporterService).generateDoraReport(request);
			doAnswer(invocation -> null).when(generateReporterService).generateBoardReport(request);
			when(generateReporterService.getComposedReportResponse(any())).thenReturn(ReportResponse.builder()
				.reportMetricsError(
						ReportMetricsError.builder().pipelineMetricsError(ErrorInfo.builder().build()).build())
				.build());
			when(reportGenerator.getReportGenerator(generateReporterService)).thenReturn(Map.of(BOARD,
					generateReporterService::generateBoardReport, DORA, generateReporterService::generateDoraReport));

			reportService.generateReport(request);

			verify(asyncMetricsDataHandler).putMetricsDataCompleted(any(),
					metricsDataCompletedArgumentCaptor.capture());
			MetricsDataCompleted metricsDataCompleted = metricsDataCompletedArgumentCaptor.getValue();
			assertEquals(metricsDataCompleted, expected);
			Awaitility.await().atMost(5, TimeUnit.SECONDS).untilAsserted(() -> {
				verify(generateReporterService).generateDoraReport(request);
				verify(generateReporterService).generateBoardReport(request);
				verify(generateReporterService).getComposedReportResponse(request.getCsvTimeStamp());
				verify(generateReporterService, never()).generateCSVForMetric(any(), any());
				verify(asyncMetricsDataHandler, times(1))
					.updateOverallMetricsCompletedInHandler(IdUtil.getDataCompletedPrefix(request.getCsvTimeStamp()));
			});
		}

		@Test
		void shouldNotGenerateMetricCsvWhenSourceControlMetricsErrorHasError() {
			MetricsDataCompleted expected = MetricsDataCompleted.builder()
				.boardMetricsCompleted(false)
				.doraMetricsCompleted(false)
				.overallMetricCompleted(false)
				.isSuccessfulCreateCsvFile(false)
				.build();
			doAnswer(invocation -> null).when(asyncMetricsDataHandler).putMetricsDataCompleted(any(), any());
			request.setMetricTypes(List.of(BOARD, DORA));
			doAnswer(invocation -> null).when(generateReporterService).generateDoraReport(request);
			doAnswer(invocation -> null).when(generateReporterService).generateBoardReport(request);
			when(generateReporterService.getComposedReportResponse(any())).thenReturn(ReportResponse.builder()
				.reportMetricsError(
						ReportMetricsError.builder().sourceControlMetricsError(ErrorInfo.builder().build()).build())
				.build());
			when(reportGenerator.getReportGenerator(generateReporterService)).thenReturn(Map.of(BOARD,
					generateReporterService::generateBoardReport, DORA, generateReporterService::generateDoraReport));

			reportService.generateReport(request);

			verify(asyncMetricsDataHandler).putMetricsDataCompleted(any(),
					metricsDataCompletedArgumentCaptor.capture());
			MetricsDataCompleted metricsDataCompleted = metricsDataCompletedArgumentCaptor.getValue();
			assertEquals(metricsDataCompleted, expected);
			Awaitility.await().atMost(5, TimeUnit.SECONDS).untilAsserted(() -> {
				verify(generateReporterService).generateDoraReport(request);
				verify(generateReporterService).generateBoardReport(request);
				verify(generateReporterService).getComposedReportResponse(request.getCsvTimeStamp());
				verify(generateReporterService, never()).generateCSVForMetric(any(), any());
				verify(asyncMetricsDataHandler, times(1))
					.updateOverallMetricsCompletedInHandler(IdUtil.getDataCompletedPrefix(request.getCsvTimeStamp()));
			});
		}

		@Test
		void shouldSuccessfulGenerateDoraReportGivenBoardReportHasBeenGeneratedWhenRetryGenerateDoraReport() {
			MetricsDataCompleted expected = MetricsDataCompleted.builder()
				.boardMetricsCompleted(true)
				.doraMetricsCompleted(false)
				.overallMetricCompleted(false)
				.isSuccessfulCreateCsvFile(false)
				.build();
			when(asyncMetricsDataHandler.getMetricsDataCompleted(any())).thenReturn(MetricsDataCompleted.builder()
				.boardMetricsCompleted(true)
				.doraMetricsCompleted(true)
				.overallMetricCompleted(true)
				.build());
			when(reportGenerator.getReportGenerator(generateReporterService)).thenReturn(Map.of(BOARD,
					generateReporterService::generateBoardReport, DORA, generateReporterService::generateDoraReport));
			doAnswer(invocation -> null).when(asyncMetricsDataHandler).putMetricsDataCompleted(any(), any());
			request.setMetricTypes(List.of(DORA));
			doAnswer(invocation -> null).when(generateReporterService).generateDoraReport(request);
			when(generateReporterService.getComposedReportResponse(any()))
				.thenReturn(ReportResponse.builder().reportMetricsError(ReportMetricsError.builder().build()).build());

			reportService.generateReport(request);

			verify(asyncMetricsDataHandler).putMetricsDataCompleted(any(),
					metricsDataCompletedArgumentCaptor.capture());
			MetricsDataCompleted metricsDataCompleted = metricsDataCompletedArgumentCaptor.getValue();
			assertEquals(metricsDataCompleted, expected);
			Awaitility.await().atMost(5, TimeUnit.SECONDS).untilAsserted(() -> {
				verify(generateReporterService).generateDoraReport(request);
				verify(generateReporterService, never()).generateBoardReport(request);
				verify(generateReporterService).getComposedReportResponse(request.getCsvTimeStamp());
				verify(generateReporterService).generateCSVForMetric(any(), any());
				verify(asyncMetricsDataHandler, times(1))
					.updateOverallMetricsCompletedInHandler(IdUtil.getDataCompletedPrefix(request.getCsvTimeStamp()));
			});
		}

	}

}
