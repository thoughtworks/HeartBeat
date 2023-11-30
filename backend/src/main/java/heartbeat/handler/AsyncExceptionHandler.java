package heartbeat.handler;

import heartbeat.exception.BaseException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AsyncExceptionHandler {

	private final Map<String, BaseException> exceptionMap = new ConcurrentHashMap<>();

	private static final Long EXPORT_CSV_VALIDITY_TIME = 1800000L;

	public void put(String reportId, BaseException e) {
		exceptionMap.put(reportId, e);
	}

	public BaseException get(String reportId) {
		return exceptionMap.remove(reportId);
	}

	public void deleteExpireException(long currentTimeStamp) {
		long exportTime = currentTimeStamp - EXPORT_CSV_VALIDITY_TIME;
		Set<String> keys = exceptionMap.keySet()
			.stream()
			.filter(reportId -> Long.parseLong(reportId) < exportTime)
			.collect(Collectors.toSet());
		exceptionMap.keySet().removeAll(keys);
	}

}
