package heartbeat.controller.report;

import heartbeat.service.generateReporter.GenerateReporterService;
import heartbeat.controller.report.vo.response.GenerateReporterResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/report")
@Validated
public class GenerateReporterController {
	private final GenerateReporterService generateReporterService;

	@GetMapping
	public GenerateReporterResponse getReport() {
		return generateReporterService.calculateVelocity();
	}
}
