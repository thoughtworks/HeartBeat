package heartbeat.handler;

import heartbeat.controller.report.dto.response.MetricsDataCompleted;
import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.exception.GenerateReportException;
import heartbeat.util.IdUtil;
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

	private final Map<String, MetricsDataCompleted> metricsDataCompletedMap = new ConcurrentHashMap<>();

	public void putReport(String reportId, ReportResponse e) {
		reportMap.put(reportId, e);
	}

	public ReportResponse getReport(String reportId) {
		return reportMap.get(reportId);
	}

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

	public void deleteExpireReport(long currentTimeStamp) {
		long exportTime = currentTimeStamp - EXPORT_CSV_VALIDITY_TIME;
		Set<String> keys = reportMap.keySet()
			.stream()
			.filter(reportId -> Long.parseLong(IdUtil.getTimeStampFromReportId(reportId)) < exportTime)
			.collect(Collectors.toSet());
		reportMap.keySet().removeAll(keys);
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
