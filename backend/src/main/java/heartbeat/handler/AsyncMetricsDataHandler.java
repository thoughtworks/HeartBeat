package heartbeat.handler;

import heartbeat.controller.report.dto.response.MetricsDataCompleted;
import heartbeat.exception.GenerateReportException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static heartbeat.service.report.scheduler.DeleteExpireCSVScheduler.EXPORT_CSV_VALIDITY_TIME;

@Component
@RequiredArgsConstructor
public class AsyncMetricsDataHandler {

	private final Map<String, MetricsDataCompleted> metricsDataCompletedMap = new ConcurrentHashMap<>();

	public void putMetricsDataCompleted(String timeStamp, MetricsDataCompleted metricsDataCompleted) {
		metricsDataCompletedMap.put(timeStamp, metricsDataCompleted);
	}

	public MetricsDataCompleted getMetricsDataCompleted(String timeStamp) {
		return metricsDataCompletedMap.get(timeStamp);
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

	public void deleteExpireMetricsDataCompleted(long currentTimeStamp) {
		long exportTime = currentTimeStamp - EXPORT_CSV_VALIDITY_TIME;
		Set<String> keys = metricsDataCompletedMap.keySet()
			.stream()
			.filter(timeStamp -> Long.parseLong(timeStamp) < exportTime)
			.collect(Collectors.toSet());
		metricsDataCompletedMap.keySet().removeAll(keys);
	}

}
