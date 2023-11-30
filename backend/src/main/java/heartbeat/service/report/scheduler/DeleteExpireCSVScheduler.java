package heartbeat.service.report.scheduler;

import heartbeat.service.report.GenerateReporterService;
import heartbeat.util.AsyncExceptionHandler;
import heartbeat.util.AsyncReportRequestHandler;
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

	private final GenerateReporterService generateReporterService;

	@Scheduled(fixedRate = DELETE_INTERVAL_IN_MINUTES, timeUnit = TimeUnit.MINUTES)
	public void triggerBatchDelete() {
		long currentTimeStamp = System.currentTimeMillis();
		log.info("Start to delete expired CSV files, currentTimeStamp: {}", currentTimeStamp);
		generateReporterService.deleteExpireCSV(currentTimeStamp, new File("./csv/"));
		AsyncReportRequestHandler.deleteExpireReport(currentTimeStamp);
		AsyncExceptionHandler.deleteExpireException(currentTimeStamp);
	}

}
