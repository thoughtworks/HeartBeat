package heartbeat.service.report;

import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.request.MetricType;
import heartbeat.controller.report.dto.request.ReportType;
import heartbeat.controller.report.dto.response.MetricsDataCompleted;
import heartbeat.controller.report.dto.response.ReportMetricsError;
import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.exception.NotFoundException;
import heartbeat.handler.AsyncMetricsDataHandler;
import heartbeat.service.report.calculator.ReportGenerator;
import heartbeat.util.IdUtil;
import heartbeat.util.TimeUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.function.Consumer;

import static heartbeat.controller.report.dto.request.MetricType.BOARD;
import static heartbeat.controller.report.dto.request.MetricType.DORA;
import static heartbeat.service.report.scheduler.DeleteExpireCSVScheduler.EXPORT_CSV_VALIDITY_TIME;

@Service
@RequiredArgsConstructor
public class ReportService {

	private final CSVFileGenerator csvFileGenerator;

	private final AsyncMetricsDataHandler asyncMetricsDataHandler;

	private final GenerateReporterService generateReporterService;

	private final ReportGenerator reportGenerator;

	private static final char FILENAME_SEPARATOR = '-';

	public InputStreamResource exportCsv(ReportType reportDataType, String csvTimestamp, String startTime,
			String endTime) {

		String timeRangeAndTimeStamp = startTime + FILENAME_SEPARATOR + endTime + FILENAME_SEPARATOR + csvTimestamp;
		if (isExpiredTimeStamp(Long.parseLong(csvTimestamp))) {
			throw new NotFoundException("Failed to fetch CSV data due to CSV not found");
		}
		return csvFileGenerator.getDataFromCSV(reportDataType, timeRangeAndTimeStamp);
	}

	private boolean isExpiredTimeStamp(long timeStamp) {
		return timeStamp < System.currentTimeMillis() - EXPORT_CSV_VALIDITY_TIME;
	}

	public void generateReport(GenerateReportRequest request) {
		List<MetricType> metricTypes = request.getMetricTypes();
		String timeRangeAndTimeStamp = request.getTimeRangeAndTimeStamp();
		initializeMetricsDataCompletedInHandler(metricTypes, timeRangeAndTimeStamp);
		Map<MetricType, Consumer<GenerateReportRequest>> reportGeneratorMap = reportGenerator
			.getReportGenerator(generateReporterService);
		List<CompletableFuture<Void>> threadList = new ArrayList<>();
		for (MetricType metricType : metricTypes) {
			CompletableFuture<Void> metricTypeThread = CompletableFuture
				.runAsync(() -> reportGeneratorMap.get(metricType).accept(request));
			threadList.add(metricTypeThread);
		}

		CompletableFuture.runAsync(() -> {
			for (CompletableFuture<Void> thread : threadList) {
				thread.join();
			}

			ReportResponse reportResponse = generateReporterService.getComposedReportResponse(request.getCsvTimeStamp(),
					convertTimeStampToYYYYMMDD(request.getStartTime()),
					convertTimeStampToYYYYMMDD(request.getEndTime()));
			if (isNotGenerateMetricError(reportResponse.getReportMetricsError())) {
				generateReporterService.generateCSVForMetric(reportResponse, request.getTimeRangeAndTimeStamp());
			}
			asyncMetricsDataHandler.updateOverallMetricsCompletedInHandler(
					IdUtil.getDataCompletedPrefix(request.getTimeRangeAndTimeStamp()));
		});
	}

	private String convertTimeStampToYYYYMMDD(String timeStamp) {
		return TimeUtil.convertToChinaSimpleISOFormat(Long.parseLong(timeStamp));
	}

	private boolean isNotGenerateMetricError(ReportMetricsError reportMetricsError) {
		return Objects.isNull(reportMetricsError.getBoardMetricsError())
				&& Objects.isNull(reportMetricsError.getSourceControlMetricsError())
				&& Objects.isNull(reportMetricsError.getPipelineMetricsError());
	}

	private void initializeMetricsDataCompletedInHandler(List<MetricType> metricTypes, String timeRangeAndTimeStamp) {
		MetricsDataCompleted previousMetricsDataCompleted = asyncMetricsDataHandler
			.getMetricsDataCompleted(IdUtil.getDataCompletedPrefix(timeRangeAndTimeStamp));
		Boolean initializeBoardMetricsCompleted = null;
		Boolean initializeDoraMetricsCompleted = null;
		if (!Objects.isNull(previousMetricsDataCompleted)) {
			initializeBoardMetricsCompleted = previousMetricsDataCompleted.boardMetricsCompleted();
			initializeDoraMetricsCompleted = previousMetricsDataCompleted.doraMetricsCompleted();
		}
		asyncMetricsDataHandler
			.putMetricsDataCompleted(IdUtil.getDataCompletedPrefix(timeRangeAndTimeStamp), MetricsDataCompleted
				.builder()
				.boardMetricsCompleted(metricTypes.contains(BOARD) ? Boolean.FALSE : initializeBoardMetricsCompleted)
				.doraMetricsCompleted(metricTypes.contains(DORA) ? Boolean.FALSE : initializeDoraMetricsCompleted)
				.overallMetricCompleted(Boolean.FALSE)
				.isSuccessfulCreateCsvFile(Boolean.FALSE)
				.build());
	}

}
