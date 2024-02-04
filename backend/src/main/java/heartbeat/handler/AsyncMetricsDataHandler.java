package heartbeat.handler;

import com.google.gson.Gson;
import heartbeat.controller.report.dto.request.MetricType;
import heartbeat.controller.report.dto.response.MetricsDataCompleted;
import heartbeat.exception.GenerateReportException;
import heartbeat.handler.base.AsyncDataBaseHandler;
import heartbeat.service.report.MetricsDataDTO;
import heartbeat.util.ValueUtil;
import lombok.RequiredArgsConstructor;
import lombok.Synchronized;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

import java.io.File;

import static heartbeat.handler.base.FIleType.METRICS_DATA_COMPLETED;

@Log4j2
@Component
@RequiredArgsConstructor
public class AsyncMetricsDataHandler extends AsyncDataBaseHandler {

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
		return readFileByType(METRICS_DATA_COMPLETED, timeStamp, MetricsDataCompleted.class);
	}

	public void deleteExpireMetricsDataCompletedFile(long currentTimeStamp, File directory) {
		deleteExpireFileByType(METRICS_DATA_COMPLETED, currentTimeStamp, directory);
	}

	@Synchronized
	public void updateMetricsDataCompletedInHandler(String timeStamp, MetricType metricType) {
		MetricsDataCompleted previousMetricsCompleted = getMetricsDataCompleted(timeStamp);
		if (previousMetricsCompleted == null) {
			log.error("Failed to update metrics data completed through this timestamp.");
			throw new GenerateReportException("Failed to update metrics data completed through this timestamp.");
		}
		switch (metricType) {
			case BOARD -> previousMetricsCompleted.setBoardMetricsCompleted(true);
			case DORA -> previousMetricsCompleted.setDoraMetricsCompleted(true);
			default -> {
			}
		}
		putMetricsDataCompleted(timeStamp, previousMetricsCompleted);
	}

	public MetricsDataDTO getReportReadyStatusByTimeStamp(String reportTimeStamp) {
		MetricsDataCompleted metricsDataCompleted = getMetricsDataCompleted(reportTimeStamp);
		if (metricsDataCompleted == null) {
			throw new GenerateReportException("Failed to locate the report using this report ID.");
		}
		boolean isBoardReady = ValueUtil.valueOrDefault(false, metricsDataCompleted.boardMetricsCompleted());
		boolean isDoraReady = ValueUtil.valueOrDefault(false, metricsDataCompleted.doraMetricsCompleted());
		boolean isReportReady = metricsDataCompleted.isAllMetricsCompleted();
		return new MetricsDataDTO(isBoardReady, isDoraReady, isReportReady);
	}

}
