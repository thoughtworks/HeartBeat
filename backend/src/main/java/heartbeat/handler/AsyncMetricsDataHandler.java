package heartbeat.handler;

import com.google.gson.Gson;
import heartbeat.controller.report.dto.request.MetricType;
import heartbeat.controller.report.dto.response.MetricsDataCompleted;
import heartbeat.exception.GenerateReportException;
import heartbeat.handler.base.AsyncDataBaseHandler;
import heartbeat.service.report.MetricsDataDTO;
import heartbeat.util.IdUtil;
import heartbeat.util.ValueUtil;
import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import lombok.Synchronized;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.Objects;
import java.util.stream.Stream;

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
	public void updateMetricsDataCompletedInHandler(String metricDataFileId, MetricType metricType) {
		MetricsDataCompleted previousMetricsCompleted = getMetricsDataCompleted(metricDataFileId);
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
		putMetricsDataCompleted(metricDataFileId, previousMetricsCompleted);
	}

	public MetricsDataDTO getReportReadyStatusByTimeStamp(String timeStamp) {
		Boolean boardReadyStatus = getReadyStatus(IdUtil.getBoardReportId(timeStamp), MetricType.BOARD);
		boolean isBoardReady = ValueUtil.valueOrDefault(false, boardReadyStatus);

		Boolean doraReadyStatus = getReadyStatus(IdUtil.getDoraReportId(timeStamp), MetricType.DORA);
		boolean isDoraReady = ValueUtil.valueOrDefault(false, doraReadyStatus);

		boolean isReportReady = Stream.of(boardReadyStatus, doraReadyStatus)
			.filter(Objects::nonNull)
			.allMatch(Boolean::booleanValue);
		return new MetricsDataDTO(isBoardReady, isDoraReady, isReportReady);
	}

	@Nullable
	private Boolean getReadyStatus(String fileId, MetricType metricType) {
		MetricsDataCompleted metricsDataCompleted = getMetricsDataCompleted(fileId);
		if (metricsDataCompleted == null) {
			return null;
		}
		else if (metricType == MetricType.BOARD) {
			return metricsDataCompleted.boardMetricsCompleted();
		}
		else {
			return metricsDataCompleted.doraMetricsCompleted();
		}
	}

}
