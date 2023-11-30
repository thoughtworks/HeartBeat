package heartbeat.util;

import heartbeat.controller.report.dto.response.ReportResponse;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

public class AsyncReportRequestHandler {

	private AsyncReportRequestHandler() {
	}

	private static final Map<String, ReportResponse> reportMap = new ConcurrentHashMap<>();

	private static final Long EXPORT_CSV_VALIDITY_TIME = 1800000L;

	public static void put(String reportId, ReportResponse e) {
		reportMap.put(reportId, e);
	}

	public static ReportResponse get(String reportId) {
		return reportMap.remove(reportId);
	}

	public static boolean isReportIsExists(String reportId) {
		return reportMap.containsKey(reportId);
	}

	public static void deleteExpireReport(long currentTimeStamp) {
		long exportTime = currentTimeStamp - EXPORT_CSV_VALIDITY_TIME;
		Set<String> keys = reportMap.keySet()
			.stream()
			.filter(reportId -> Long.parseLong(reportId) < exportTime)
			.collect(Collectors.toSet());
		reportMap.keySet().removeAll(keys);
	}

}
