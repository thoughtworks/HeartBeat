package heartbeat.controller.report;

import heartbeat.controller.report.dto.request.ExportCSVRequest;
import heartbeat.controller.report.dto.request.GenerateBoardReportRequest;
import heartbeat.controller.report.dto.request.GenerateDoraReportRequest;
import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.response.CallbackResponse;
import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.exception.BaseException;
import heartbeat.handler.AsyncExceptionHandler;
import heartbeat.service.report.GenerateReporterService;
import heartbeat.util.IdUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.CompletableFuture;

@RestController
@RequiredArgsConstructor
@RequestMapping()
@Validated
@Log4j2
public class GenerateReportController {

	private final GenerateReporterService generateReporterService;

	private final AsyncExceptionHandler asyncExceptionHandler;

	@Value("${callback.interval}")
	private Integer interval;

	@PostMapping("/reports")
	public ResponseEntity<CallbackResponse> generateReport(@RequestBody GenerateReportRequest request) {
		log.info(
				"Start to generate Report, metrics: {}, consider holiday: {}, start time: {}, end time: {}, report id: {}",
				request.getMetrics(), request.getConsiderHoliday(), request.getStartTime(), request.getEndTime(),
				request.getCsvTimeStamp());
		CompletableFuture.runAsync(() -> {
			try {
				generateReporterService.generateReporter(request);
			}
			catch (BaseException e) {
				asyncExceptionHandler.put(request.getCsvTimeStamp(), e);
			}
		});
		String callbackUrl = "/reports/" + request.getCsvTimeStamp();
		return ResponseEntity.status(HttpStatus.ACCEPTED)
			.body(CallbackResponse.builder().callbackUrl(callbackUrl).interval(interval).build());
	}

	@GetMapping("/reports/{dataType}/{filename}")
	public InputStreamResource exportCSV(@PathVariable String dataType, @PathVariable String filename) {
		log.info("Start to export CSV file, dataType: {}, time stamp: {}", dataType, filename);
		ExportCSVRequest request = new ExportCSVRequest(dataType, filename);
		InputStreamResource result = generateReporterService.fetchCSVData(request);
		log.info("Successfully get CSV file, dataType: {}, time stamp: {}, result: {}", dataType, filename, result);
		return result;
	}

	@GetMapping("/reports/{reportId}")
	public ResponseEntity<ReportResponse> generateReport(@PathVariable String reportId) {
		boolean generateReportIsOver = generateReporterService.checkGenerateReportIsDone(reportId);
		ReportResponse reportResponse = generateReporterService.getComposedReportResponse(reportId);
		if (generateReportIsOver) {
			log.info("Successfully generate Report, report id: {}, reports: {}", reportId, reportResponse);
			// todo: calculate the time to generate csv file
			generateReporterService.generateCSVForMetric(reportResponse, reportId);
			return ResponseEntity.status(HttpStatus.CREATED).body(reportResponse);
		}
		return ResponseEntity.status(HttpStatus.OK).body(reportResponse);
	}

	@PostMapping("/board-reports")
	public ResponseEntity<CallbackResponse> generateBoardReport(@RequestBody GenerateBoardReportRequest request) {
		log.info(
				"Start to generate board report, metrics: {}, consider holiday: {}, start time: {}, end time: {}, report id: {}",
				request.getMetrics(), request.getConsiderHoliday(), request.getStartTime(), request.getEndTime(),
				IdUtil.getBoardReportId(request.getCsvTimeStamp()));
		generateReporterService.saveMetricsDataReadyInHandler(request.getCsvTimeStamp(), request.getMetrics(), true);
		CompletableFuture.runAsync(() -> {
			try {
				ReportResponse reportResponse = generateReporterService
					.generateReporter(request.convertToReportRequest());
				generateReporterService.saveReporterInHandler(reportResponse,
						IdUtil.getBoardReportId(request.getCsvTimeStamp()));
				generateReporterService.saveMetricsDataReadyInHandler(request.getCsvTimeStamp(), request.getMetrics(),
						false);

			}
			catch (BaseException e) {
				asyncExceptionHandler.put(request.getCsvTimeStamp(), e);
			}
		});

		String callbackUrl = "/reports/" + request.getCsvTimeStamp();
		return ResponseEntity.status(HttpStatus.ACCEPTED)
			.body(CallbackResponse.builder().callbackUrl(callbackUrl).interval(interval).build());
	}

	@PostMapping("/dora-reports")
	public ResponseEntity<CallbackResponse> generateDoraReport(@RequestBody GenerateDoraReportRequest request){
		log.info(
			"Start to generate Report, metrics: {}, consider holiday: {}, start time: {}, end time: {}, report id: {}",
			request.getMetrics(), request.getConsiderHoliday(), request.getStartTime(), request.getEndTime(),
			IdUtil.getDoraReportId(request.getCsvTimeStamp()));
		generateReporterService.saveMetricsDataReadyInHandler(request.getCsvTimeStamp(), request.getMetrics(), true);
		CompletableFuture.runAsync(() -> {
			try {
				ReportResponse reportResponse = generateReporterService
					.generateReporter(request.convertToReportRequest());
				generateReporterService.saveReporterInHandler(reportResponse,
					IdUtil.getDoraReportId(request.getCsvTimeStamp()));
				generateReporterService.saveMetricsDataReadyInHandler(request.getCsvTimeStamp(), request.getMetrics(),
					false);
			}
			catch (BaseException e) {
				asyncExceptionHandler.put(request.getCsvTimeStamp(), e);
			}
		});

		String callbackUrl = "/reports/" + request.getCsvTimeStamp();
		return ResponseEntity.status(HttpStatus.ACCEPTED)
			.body(CallbackResponse.builder().callbackUrl(callbackUrl).interval(interval).build());
	}

}
