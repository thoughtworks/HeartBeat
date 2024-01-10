package heartbeat.controller.report;

import heartbeat.controller.report.dto.request.DataType;
import heartbeat.controller.report.dto.request.ReportType;
import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.request.ExportCSVRequest;
import heartbeat.controller.report.dto.response.CallbackResponse;
import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.service.report.GenerateReporterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.concurrent.CompletableFuture;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reports")
@Validated
@Log4j2
public class GenerateReportController {

	private final GenerateReporterService generateReporterService;

	@Value("${callback.interval}")
	private Integer interval;

	@GetMapping("/{dataType}/{filename}")
	public InputStreamResource exportCSV(@PathVariable DataType dataType, @PathVariable String filename) {
		log.info("Start to export CSV file, _dataType: {}, _timeStamp: {}", dataType, filename);
		ExportCSVRequest request = new ExportCSVRequest(dataType.name().toLowerCase(), filename);
		InputStreamResource result = generateReporterService.fetchCSVData(request);
		log.info("Successfully get CSV file, _dataType: {}, _timeStamp: {}, _result: {}", dataType, filename, result);
		return result;
	}

	@GetMapping("/{reportId}")
	public ResponseEntity<ReportResponse> generateReport(@PathVariable String reportId) {
		boolean generateReportIsOver = generateReporterService.checkGenerateReportIsDone(reportId);
		ReportResponse reportResponse = generateReporterService.getComposedReportResponse(reportId,
				generateReportIsOver);
		if (generateReportIsOver) {
			log.info("Successfully generate Report, _reportId: {}, _reports: {}", reportId, reportResponse);
			generateReporterService.generateCSVForMetric(reportResponse, reportId);
			return ResponseEntity.status(HttpStatus.CREATED).body(reportResponse);
		}
		return ResponseEntity.status(HttpStatus.OK).body(reportResponse);
	}

	@PostMapping("{reportType}")
	public ResponseEntity<CallbackResponse> generateReport(@PathVariable ReportType reportType,
			@RequestBody GenerateReportRequest request) {
		CompletableFuture.runAsync(() -> {
			switch (reportType) {
				case BOARD -> generateReporterService.generateBoardReport(request);
				case DORA -> generateReporterService.generateDoraReport(request);
			}
		});
		String callbackUrl = "/reports/" + request.getCsvTimeStamp();
		return ResponseEntity.status(HttpStatus.ACCEPTED)
			.body(CallbackResponse.builder().callbackUrl(callbackUrl).interval(interval).build());
	}

}
