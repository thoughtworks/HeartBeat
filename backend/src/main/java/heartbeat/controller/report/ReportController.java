package heartbeat.controller.report;

import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.request.ReportType;
import heartbeat.controller.report.dto.response.CallbackResponse;
import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.service.report.GenerateReporterService;
import heartbeat.service.report.ReportService;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
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

@RestController
@RequiredArgsConstructor
@Tag(name = "Report")
@RequestMapping("/reports")
@Validated
@Log4j2
public class ReportController {

	private final GenerateReporterService generateReporterService;

	private final ReportService reportService;

	@Value("${callback.interval}")
	private Integer interval;

	@GetMapping("/{reportType}/{filename}")
	public InputStreamResource exportCSV(
			@Schema(type = "string", allowableValues = { "metric", "pipeline", "board" },
					accessMode = Schema.AccessMode.READ_ONLY) @PathVariable() ReportType reportType,
			@PathVariable String filename) {
		log.info("Start to export CSV file_reportType: {}, filename: {}", reportType.getValue(), filename);
		InputStreamResource result = reportService.exportCsv(reportType, Long.parseLong(filename));
		log.info("Successfully get CSV file_reportType: {}, filename: {}, _result: {}", reportType.getValue(), filename,
				result);
		return result;
	}

	@GetMapping("/{reportId}")
	public ResponseEntity<ReportResponse> generateReport(@PathVariable String reportId) {
		log.info("Start to generate report_reportId: {}", reportId);
		ReportResponse reportResponse = generateReporterService.getComposedReportResponse(reportId);
		return ResponseEntity.status(HttpStatus.OK).body(reportResponse);
	}

	@PostMapping
	public ResponseEntity<CallbackResponse> generateReport(@RequestBody GenerateReportRequest request) {
		log.info("Start to generate report");
		reportService.generateReport(request);
		String callbackUrl = "/reports/" + request.getCsvTimeStamp();
		log.info("Successfully generate report");
		return ResponseEntity.status(HttpStatus.ACCEPTED)
			.body(CallbackResponse.builder().callbackUrl(callbackUrl).interval(interval).build());
	}

}
