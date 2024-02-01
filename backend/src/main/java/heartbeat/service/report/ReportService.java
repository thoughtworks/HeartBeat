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
import static heartbeat.util.ValueUtil.valueOrDefault;

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
		initializeMetricsDataCompletedInHandler(request);
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

	private MetricsDataCompleted createMetricsDataCompleted(MetricsDataCompleted metricProcess,
			MetricsDataCompleted previousMetricsCompleted) {
		return previousMetricsCompleted == null
				? MetricsDataCompleted.builder()
					.boardMetricsCompleted(metricProcess.boardMetricsCompleted())
					.pipelineMetricsCompleted(metricProcess.pipelineMetricsCompleted())
					.sourceControlMetricsCompleted(metricProcess.sourceControlMetricsCompleted())
					.build()
				: MetricsDataCompleted.builder()
					.boardMetricsCompleted(valueOrDefault(previousMetricsCompleted.boardMetricsCompleted(),
							metricProcess.boardMetricsCompleted()))
					.pipelineMetricsCompleted(valueOrDefault(previousMetricsCompleted.pipelineMetricsCompleted(),
							metricProcess.pipelineMetricsCompleted()))
					.sourceControlMetricsCompleted(
							valueOrDefault(previousMetricsCompleted.sourceControlMetricsCompleted(),
									metricProcess.sourceControlMetricsCompleted()))
					.build();

	}

	private void initializeMetricsDataCompletedInHandler(GenerateReportRequest request) {
		MetricsDataCompleted metricsStatus = request.getMetricsStatus(Boolean.FALSE);
		String timeStamp = request.getCsvTimeStamp();
		MetricsDataCompleted previousMetricsCompleted = asyncMetricsDataHandler.getMetricsDataCompleted(timeStamp);
		MetricsDataCompleted isMetricsDataCompleted = createMetricsDataCompleted(metricsStatus,
				previousMetricsCompleted);
		asyncMetricsDataHandler.putMetricsDataCompleted(timeStamp, isMetricsDataCompleted);
	}

}
