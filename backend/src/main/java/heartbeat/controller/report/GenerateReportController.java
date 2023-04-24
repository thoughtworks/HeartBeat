package heartbeat.controller.report;

import heartbeat.service.report.GenerateReporterService;
import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.response.GenerateReportResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/report")
@Validated
public class GenerateReportController {

	private final GenerateReporterService generateReporterService;

	@PostMapping
	public GenerateReportResponse getReport(@RequestBody GenerateReportRequest request) {
		return generateReporterService.generateReporter(request);
	}

}
