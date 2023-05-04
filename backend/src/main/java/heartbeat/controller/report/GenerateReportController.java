package heartbeat.controller.report;

import heartbeat.service.report.GenerateReporterService;
import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.response.GenerateReportResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reports")
@Validated
@Log4j2
public class GenerateReportController {

	private final GenerateReporterService generateReporterService;

	@PostMapping
	public GenerateReportResponse generateReport(@RequestBody GenerateReportRequest request) {
		log.info("Start to generate Report, request: {} ", request);
		return generateReporterService.generateReporter(request);
	}

}
