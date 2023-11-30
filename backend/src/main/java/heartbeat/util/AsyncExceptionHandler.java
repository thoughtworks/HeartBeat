package heartbeat.util;

import heartbeat.exception.BaseException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class AsyncExceptionHandler {

	private AsyncExceptionHandler() {}

	private static final Map<String, BaseException> exceptionMap = new ConcurrentHashMap<>();

	public static void put(String reportId, BaseException e) {
			exceptionMap.put(reportId, e);
	}

	public static BaseException get(String reportId) {
		return exceptionMap.get(reportId);
	}

}
