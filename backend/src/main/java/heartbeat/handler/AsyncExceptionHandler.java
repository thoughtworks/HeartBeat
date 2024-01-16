package heartbeat.handler;

import heartbeat.exception.BaseException;
import heartbeat.util.IdUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import static heartbeat.service.report.scheduler.DeleteExpireCSVScheduler.EXPORT_CSV_VALIDITY_TIME;

@Component
@RequiredArgsConstructor
public class AsyncExceptionHandler {

	private final Map<String, BaseException> exceptionMap = new ConcurrentHashMap<>();

	public void put(String reportId, BaseException e) {
		exceptionMap.put(reportId, e);
	}

	public BaseException get(String reportId) {
		return exceptionMap.get(reportId);
	}

	public BaseException remove(String reportId) {
		return exceptionMap.remove(reportId);
	}

	public void deleteExpireException(long currentTimeStamp) {
		long exportTime = currentTimeStamp - EXPORT_CSV_VALIDITY_TIME;
		Set<String> keys = exceptionMap.keySet()
			.stream()
			.filter(reportId -> Long.parseLong(IdUtil.getTimeStampFromReportId(reportId)) < exportTime)
			.collect(Collectors.toSet());
		exceptionMap.keySet().removeAll(keys);
	}

}
