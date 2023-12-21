package heartbeat.handler;

import heartbeat.controller.report.dto.response.MetricsDataReady;
import heartbeat.controller.report.dto.response.ReportResponse;
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
public class AsyncReportRequestHandler {

	private final Map<String, ReportResponse> reportMap = new ConcurrentHashMap<>();

	private final Map<String, MetricsDataReady> metricsDataReadyMap = new ConcurrentHashMap<>();

	public void putReport(String reportId, ReportResponse e) {
		reportMap.put(reportId, e);
	}

	public ReportResponse getAndRemoveReport(String reportId) {
		return reportMap.remove(reportId);
	}

	public void putMetricsDataReady(String timeStamp, MetricsDataReady metricsDataReady) {
		metricsDataReadyMap.put(timeStamp, metricsDataReady);
	}

	public MetricsDataReady getMetricsDataReady(String timeStamp) {
		return metricsDataReadyMap.get(timeStamp);
	}

	public boolean isReportReady(String timeStamp) {
		MetricsDataReady metricsDataReady = metricsDataReadyMap.get(timeStamp);
		if (metricsDataReady == null) {
			throw new GenerateReportException("Unable to locate the report using this report ID.");
		}

		List<Boolean> metricsReady = Stream
			.of(metricsDataReady.getBoardMetricsReady(), metricsDataReady.getPipelineMetricsReady(),
					metricsDataReady.getSourceControlMetricsReady())
			.filter(Objects::nonNull)
			.collect(Collectors.toList());

		return metricsReady.stream().allMatch(Boolean::valueOf);
	}

	public void deleteExpireReport(long currentTimeStamp) {
		long exportTime = currentTimeStamp - EXPORT_CSV_VALIDITY_TIME;
		Set<String> keys = reportMap.keySet()
			.stream()
			.filter(reportId -> Long.parseLong(reportId) < exportTime)
			.collect(Collectors.toSet());
		reportMap.keySet().removeAll(keys);
	}

}
