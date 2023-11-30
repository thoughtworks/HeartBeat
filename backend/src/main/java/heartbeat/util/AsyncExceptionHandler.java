package heartbeat.util;

import heartbeat.exception.BaseException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

public class AsyncExceptionHandler {

	private AsyncExceptionHandler() {
	}

	private static final Map<String, BaseException> exceptionMap = new ConcurrentHashMap<>();

	private static final Long EXPORT_CSV_VALIDITY_TIME = 1800000L;

	public static void put(String reportId, BaseException e) {
		exceptionMap.put(reportId, e);
	}

	public static BaseException get(String reportId) {
		return exceptionMap.remove(reportId);
	}

	public static void deleteExpireException(long currentTimeStamp) {
		long exportTime = currentTimeStamp - EXPORT_CSV_VALIDITY_TIME;
		Set<String> keys = exceptionMap.keySet()
			.stream()
			.filter(reportId -> Long.parseLong(reportId) < exportTime)
			.collect(Collectors.toSet());
		exceptionMap.keySet().removeAll(keys);
	}

}
