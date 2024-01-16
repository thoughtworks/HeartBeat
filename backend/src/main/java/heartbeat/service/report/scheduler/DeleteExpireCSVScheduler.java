package heartbeat.service.report.scheduler;

import heartbeat.handler.AsyncReportRequestHandler;
import heartbeat.service.report.GenerateReporterService;
import heartbeat.handler.AsyncExceptionHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.concurrent.TimeUnit;

@Log4j2
@Component
@RequiredArgsConstructor
public class DeleteExpireCSVScheduler {

	public static final int DELETE_INTERVAL_IN_MINUTES = 5;

	public static final Long EXPORT_CSV_VALIDITY_TIME = 1800000L;

	private final GenerateReporterService generateReporterService;

	private final AsyncReportRequestHandler asyncReportRequestHandler;

	private final AsyncExceptionHandler asyncExceptionHandler;

	@Scheduled(fixedRate = DELETE_INTERVAL_IN_MINUTES, timeUnit = TimeUnit.MINUTES)
	public void triggerBatchDelete() {
		long currentTimeStamp = System.currentTimeMillis();
		log.info("Start to delete expired CSV files, currentTimeStamp: {}", currentTimeStamp);
		generateReporterService.deleteExpireCSV(currentTimeStamp, new File("./csv/"));
		asyncReportRequestHandler.deleteExpireReport(currentTimeStamp);
		asyncReportRequestHandler.deleteExpireMetricsDataCompleted(currentTimeStamp);
		asyncExceptionHandler.deleteExpireException(currentTimeStamp);
	}

}
