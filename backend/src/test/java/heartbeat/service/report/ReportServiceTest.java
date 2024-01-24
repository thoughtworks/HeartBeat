package heartbeat.service.report;

import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.request.ReportDataType;
import heartbeat.controller.report.dto.request.ReportType;
import heartbeat.controller.report.dto.response.MetricsDataCompleted;
import heartbeat.handler.AsyncMetricsDataHandler;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.mockito.stubbing.Answer;
import org.springframework.core.io.InputStreamResource;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import heartbeat.exception.NotFoundException;

import static heartbeat.service.report.scheduler.DeleteExpireCSVScheduler.EXPORT_CSV_VALIDITY_TIME;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.never;

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

	@Test
	void exportCsvShouldCallCsvFileGeneratorToGotTheStreamWhenTimestampIsValid() throws IOException {
		long validTimestamp = System.currentTimeMillis() - EXPORT_CSV_VALIDITY_TIME + 20000L;
		when(csvFileGenerator.getDataFromCSV(ReportDataType.METRIC, validTimestamp))
			.thenReturn(new InputStreamResource(new ByteArrayInputStream("csv data".getBytes())));

		InputStream result = reportService.exportCsv(ReportDataType.METRIC, validTimestamp).getInputStream();
		String returnData = new BufferedReader(new InputStreamReader(result)).lines().collect(Collectors.joining("\n"));

		assertEquals(returnData, "csv data");
		verify(csvFileGenerator).getDataFromCSV(ReportDataType.METRIC, validTimestamp);
	}

	@Test
	void exportCsvShouldThrowNotFoundExceptionWhenTimestampIsValid() {
		long invalidTimestamp = System.currentTimeMillis() - EXPORT_CSV_VALIDITY_TIME - 20000L;

		assertThrows(NotFoundException.class, () -> reportService.exportCsv(ReportDataType.METRIC, invalidTimestamp));
		verify(csvFileGenerator, never()).getDataFromCSV(ReportDataType.METRIC, invalidTimestamp);
	}

	@Test
	void generateBoardReportByTypeShouldCallGenerateBoardReport() throws InterruptedException {
		GenerateReportRequest request = GenerateReportRequest.builder().metrics(new ArrayList<>()).build();
		doAnswer(invocation -> null).when(generateReporterService).generateBoardReport(request);
		reportService.generateReportByType(request, ReportType.BOARD);
		Thread.sleep(100);
		verify(generateReporterService).generateBoardReport(request);
		verify(generateReporterService, never()).generateDoraReport(request);
	}

	@Test
	void generateDoraReportByTypeShouldCallGenerateDoraReport() throws InterruptedException {
		GenerateReportRequest request = GenerateReportRequest.builder().metrics(new ArrayList<>()).build();
		doAnswer(invocation -> null).when(generateReporterService).generateDoraReport(request);
		reportService.generateReportByType(request, ReportType.DORA);
		Thread.sleep(100);
		verify(generateReporterService).generateDoraReport(request);
		verify(generateReporterService, never()).generateBoardReport(request);
	}

	@Test
	void ShouldInitializeMetricsDataCompletedInHandlerWithPreOneWhenPreOneExisted() throws InterruptedException {
		GenerateReportRequest request = GenerateReportRequest.builder().metrics(new ArrayList<>()).build();
		when(asyncMetricsDataHandler.getMetricsDataCompleted(any())).thenReturn(MetricsDataCompleted.builder().build());
		doAnswer(invocation -> null).when(generateReporterService).generateBoardReport(request);
		reportService.generateReportByType(request, ReportType.BOARD);
		Thread.sleep(100);
		verify(generateReporterService).generateBoardReport(request);
		verify(generateReporterService, never()).generateDoraReport(request);
	}

}
