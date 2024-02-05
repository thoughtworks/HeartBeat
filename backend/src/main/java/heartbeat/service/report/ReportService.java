package heartbeat.service.report;

import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.request.ReportType;
import heartbeat.controller.report.dto.request.MetricType;
import heartbeat.controller.report.dto.response.MetricsDataCompleted;
import heartbeat.exception.NotFoundException;
import heartbeat.handler.AsyncMetricsDataHandler;
import heartbeat.util.IdUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

import static heartbeat.service.report.scheduler.DeleteExpireCSVScheduler.EXPORT_CSV_VALIDITY_TIME;

@Service
@RequiredArgsConstructor
public class ReportService {

	private final CSVFileGenerator csvFileGenerator;

	private final AsyncMetricsDataHandler asyncMetricsDataHandler;

	private final GenerateReporterService generateReporterService;

	public InputStreamResource exportCsv(ReportType reportDataType, long csvTimestamp) {
		if (isExpiredTimeStamp(csvTimestamp)) {
			throw new NotFoundException("Failed to fetch CSV data due to CSV not found");
		}
		return csvFileGenerator.getDataFromCSV(reportDataType, csvTimestamp);
	}

	private boolean isExpiredTimeStamp(long timeStamp) {
		return timeStamp < System.currentTimeMillis() - EXPORT_CSV_VALIDITY_TIME;
	}

	public void generateReportByType(GenerateReportRequest request, MetricType metricType) {
		initializeMetricsDataCompletedInHandler(request.getCsvTimeStamp(), metricType);
		CompletableFuture.runAsync(() -> {
			switch (metricType) {
				case BOARD -> generateReporterService.generateBoardReport(request);
				case DORA -> generateReporterService.generateDoraReport(request);
				default -> {
					// TODO
				}
			}
		});
	}

	public void initializeMetricsDataCompletedInHandler(String timeStamp, MetricType metricType) {
		if (metricType == MetricType.BOARD) {
			asyncMetricsDataHandler.putMetricsDataCompleted(IdUtil.getBoardReportId(timeStamp),
					MetricsDataCompleted.builder().boardMetricsCompleted(false).build());
		}
		else {
			asyncMetricsDataHandler.putMetricsDataCompleted(IdUtil.getDoraReportId(timeStamp),
					MetricsDataCompleted.builder().doraMetricsCompleted(false).build());
		}
	}

}
