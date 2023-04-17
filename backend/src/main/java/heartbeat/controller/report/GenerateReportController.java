package heartbeat.controller.report;

import heartbeat.controller.report.vo.request.GenerateReportRequest;
import heartbeat.controller.report.vo.response.GenerateReportResponse;
import heartbeat.service.report.GenerateReporterService;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/report")
@Validated
public class GenerateReportController {

	private final GenerateReporterService generateReporterService;

	@GetMapping
	public GenerateReportResponse getReport(GenerateReportRequest request) {
		return generateReporterService.generateReporter(request);
	}

}
