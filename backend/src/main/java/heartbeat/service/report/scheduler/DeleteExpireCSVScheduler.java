package heartbeat.service.report.scheduler;

import heartbeat.handler.AsyncMetricsDataHandler;
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

	public static final String CSV_FILE_PATH = "./app/output/csv/";

	public static final String REPORT_FILE_PATH = "./app/output/report/";

	public static final String ERROR_FILE_PATH = "./app/output/error/";

	public static final String METRICS_FILE_PATH = "./app/output/metrics-data-completed/";

	private final GenerateReporterService generateReporterService;

	private final AsyncReportRequestHandler asyncReportRequestHandler;

	private final AsyncMetricsDataHandler asyncMetricsDataHandler;

	private final AsyncExceptionHandler asyncExceptionHandler;

	@Scheduled(fixedRate = DELETE_INTERVAL_IN_MINUTES, timeUnit = TimeUnit.MINUTES)
	public void triggerBatchDelete() {
		long currentTimeStamp = System.currentTimeMillis();
		log.info("Start to delete expired files, currentTimeStamp: {}", currentTimeStamp);
		generateReporterService.deleteExpireCSV(currentTimeStamp, new File(CSV_FILE_PATH));
		asyncReportRequestHandler.deleteExpireReportFile(currentTimeStamp, new File(REPORT_FILE_PATH));
		asyncMetricsDataHandler.deleteExpireMetricsDataCompletedFile(currentTimeStamp, new File(METRICS_FILE_PATH));
		asyncExceptionHandler.deleteExpireExceptionFile(currentTimeStamp, new File(ERROR_FILE_PATH));
	}

}
