package heartbeat.service.report;

import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.request.ReportType;
import heartbeat.controller.report.dto.request.MetricType;
import heartbeat.controller.report.dto.response.MetricsDataCompleted;
import heartbeat.exception.NotFoundException;
import heartbeat.handler.AsyncMetricsDataHandler;
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

	private MetricsDataCompleted getInitializedData(MetricType metricType,
			MetricsDataCompleted previousMetricsCompleted) {
		MetricsDataCompleted metricsDataCompleted = MetricsDataCompleted.builder().build();
		if (previousMetricsCompleted == null) {
			if (metricType == MetricType.BOARD) {
				metricsDataCompleted.setBoardMetricsCompleted(false);
			}
			else {
				metricsDataCompleted.setDoraMetricsCompleted(false);
			}
		}
		else {
			if (metricType == MetricType.BOARD) {
				metricsDataCompleted.setBoardMetricsCompleted(false);
				metricsDataCompleted.setDoraMetricsCompleted(previousMetricsCompleted.doraMetricsCompleted());
			}
			else {
				metricsDataCompleted.setDoraMetricsCompleted(false);
				metricsDataCompleted.setBoardMetricsCompleted(previousMetricsCompleted.boardMetricsCompleted());
			}
		}
		return metricsDataCompleted;
	}

	public void initializeMetricsDataCompletedInHandler(String timeStamp, MetricType metricType) {
		MetricsDataCompleted previousMetricsCompleted = asyncMetricsDataHandler.getMetricsDataCompleted(timeStamp);
		MetricsDataCompleted initializedData = getInitializedData(metricType, previousMetricsCompleted);
		asyncMetricsDataHandler.putMetricsDataCompleted(timeStamp, initializedData);
	}

}
