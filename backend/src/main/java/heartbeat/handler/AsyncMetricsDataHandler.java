package heartbeat.handler;

import com.google.gson.Gson;
import heartbeat.controller.report.dto.response.MetricsDataCompleted;
import heartbeat.exception.GenerateReportException;
import heartbeat.handler.base.AsyncDataBaseHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

import static heartbeat.handler.base.FIleType.METRICS_DATA_COMPLETED;

@Component
@RequiredArgsConstructor
public class AsyncMetricsDataHandler extends AsyncDataBaseHandler {

	public void putMetricsDataCompleted(String timeStamp, MetricsDataCompleted metricsDataCompleted) {
		createFileByType(METRICS_DATA_COMPLETED, timeStamp, new Gson().toJson(metricsDataCompleted));
	}

	public MetricsDataCompleted getMetricsDataCompleted(String timeStamp) {
		return readFileByType(METRICS_DATA_COMPLETED, timeStamp, MetricsDataCompleted.class);
	}

	public boolean isReportReady(String timeStamp) {
		MetricsDataCompleted metricsDataCompleted = getMetricsDataCompleted(timeStamp);
		if (metricsDataCompleted == null) {
			throw new GenerateReportException("Failed to locate the report using this report ID.");
		}

		List<Boolean> metricsReady = Stream
			.of(metricsDataCompleted.boardMetricsCompleted(), metricsDataCompleted.pipelineMetricsCompleted(),
					metricsDataCompleted.sourceControlMetricsCompleted())
			.filter(Objects::nonNull)
			.toList();

		return metricsReady.stream().allMatch(Boolean::valueOf);
	}

	public void deleteExpireMetricsDataCompletedFile(long currentTimeStamp, File directory) {
		deleteExpireFileByType(METRICS_DATA_COMPLETED, currentTimeStamp, directory);
	}

}
