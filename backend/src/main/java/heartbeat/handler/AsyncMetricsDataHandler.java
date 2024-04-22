package heartbeat.handler;

import com.google.gson.Gson;
import heartbeat.controller.report.dto.request.MetricType;
import heartbeat.controller.report.dto.response.MetricsDataCompleted;
import heartbeat.exception.GenerateReportException;
import heartbeat.handler.base.AsyncDataBaseHandler;
import lombok.RequiredArgsConstructor;
import lombok.Synchronized;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

import java.io.File;
import java.nio.file.Path;

import static heartbeat.handler.base.FIleType.METRICS_DATA_COMPLETED;

@Log4j2
@Component
@RequiredArgsConstructor
public class AsyncMetricsDataHandler extends AsyncDataBaseHandler {

	private static final String GENERATE_REPORT_ERROR = "Failed to update metrics data completed through this timestamp.";

	private static final String OUTPUT_FILE_PATH = "./app/output/";

	private static final String SLASH = "/";

	public void putMetricsDataCompleted(String timeStamp, MetricsDataCompleted metricsDataCompleted) {
		try {
			acquireLock(METRICS_DATA_COMPLETED, timeStamp);
			createFileByType(METRICS_DATA_COMPLETED, timeStamp, new Gson().toJson(metricsDataCompleted));
		}
		finally {
			unLock(METRICS_DATA_COMPLETED, timeStamp);
		}
	}

	public MetricsDataCompleted getMetricsDataCompleted(String timeStamp) {
		Path targetPath = new File(OUTPUT_FILE_PATH).toPath().normalize();
		String fileName = targetPath + SLASH + METRICS_DATA_COMPLETED.getPath() + timeStamp;
		return readFileByType(new File(fileName), METRICS_DATA_COMPLETED, timeStamp, MetricsDataCompleted.class);
	}

	public void deleteExpireMetricsDataCompletedFile(long currentTimeStamp, File directory) {
		deleteExpireFileByType(METRICS_DATA_COMPLETED, currentTimeStamp, directory);
	}

	@Synchronized
	public void updateMetricsDataCompletedInHandler(String metricDataFileId, MetricType metricType,
			boolean isCreateCsvSuccess) {
		MetricsDataCompleted previousMetricsCompleted = getMetricsDataCompleted(metricDataFileId);
		if (previousMetricsCompleted == null) {
			log.error(GENERATE_REPORT_ERROR);
			throw new GenerateReportException(GENERATE_REPORT_ERROR);
		}
		if (isCreateCsvSuccess) {
			previousMetricsCompleted.setIsSuccessfulCreateCsvFile(true);
		}
		switch (metricType) {
			case BOARD -> previousMetricsCompleted.setBoardMetricsCompleted(true);
			case DORA -> previousMetricsCompleted.setDoraMetricsCompleted(true);
			default -> {
			}
		}
		putMetricsDataCompleted(metricDataFileId, previousMetricsCompleted);
	}

	public void updateOverallMetricsCompletedInHandler(String metricDataFileId) {
		MetricsDataCompleted previousMetricsCompleted = getMetricsDataCompleted(metricDataFileId);
		if (previousMetricsCompleted == null) {
			log.error(GENERATE_REPORT_ERROR);
			throw new GenerateReportException(GENERATE_REPORT_ERROR);
		}
		previousMetricsCompleted.setOverallMetricCompleted(true);
		putMetricsDataCompleted(metricDataFileId, previousMetricsCompleted);
	}

}
