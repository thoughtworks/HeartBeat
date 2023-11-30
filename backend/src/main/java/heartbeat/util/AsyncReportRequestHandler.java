package heartbeat.util;

import heartbeat.controller.report.dto.response.ReportResponse;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class AsyncReportRequestHandler {

	private AsyncReportRequestHandler() {
	}

	private static final Map<String, ReportResponse> exceptionMap = new ConcurrentHashMap<>();

	public static void put(String reportId, ReportResponse e) {
		exceptionMap.put(reportId, e);
	}

	public static ReportResponse get(String reportId) {
		return exceptionMap.remove(reportId);
	}

	public static boolean isReportIsExists(String reportId) {
		return exceptionMap.containsKey(reportId);
	}

}
