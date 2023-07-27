package heartbeat.controller.report;

import heartbeat.controller.report.dto.request.ExportCSVRequest;
import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.service.report.GenerateReporterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.InputStreamResource;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reports")
@Validated
@Log4j2
public class GenerateReportController {

	private final GenerateReporterService generateReporterService;

	@PostMapping
	public ReportResponse generateReport(@RequestBody GenerateReportRequest request) {
		log.info("Start to generate Report, metrics: {}, consider holiday: {}, start time: {}, end time: {}",
				request.getMetrics(), request.getConsiderHoliday(), request.getStartTime(), request.getEndTime());
		ReportResponse reports = generateReporterService.generateReporter(request);
		log.info(
				"Successfully generate Report, metrics: {}, consider holiday: {}, start time: {}, end time: {}, reports: {}",
				request.getMetrics(), request.getConsiderHoliday(), request.getStartTime(), request.getEndTime(),
				reports);
		return reports;
	}

	@GetMapping("/{dataType}/{filename}")
	public InputStreamResource exportCSV(@PathVariable String dataType, @PathVariable String filename) {
		log.info("Start to export CSV file, dataType: {}, time stamp: {}", dataType, filename);
		ExportCSVRequest request = new ExportCSVRequest(dataType, filename);
		InputStreamResource result = generateReporterService.fetchCSVData(request);
		log.info("Successfully get CSV file, dataType: {}, time stamp: {}, result: {}", dataType, filename, result);
		return result;
	}

}
