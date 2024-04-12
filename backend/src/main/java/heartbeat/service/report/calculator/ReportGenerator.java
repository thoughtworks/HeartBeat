package heartbeat.service.report.calculator;

import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.request.MetricType;
import heartbeat.service.report.GenerateReporterService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.function.Consumer;

import static heartbeat.controller.report.dto.request.MetricType.BOARD;
import static heartbeat.controller.report.dto.request.MetricType.DORA;

@RequiredArgsConstructor
@Component
public class ReportGenerator {

	public Map<MetricType, Consumer<GenerateReportRequest>> getReportGenerator(
			GenerateReporterService generateReporterService) {
		return Map.of(BOARD, generateReporterService::generateBoardReport, DORA,
				generateReporterService::generateDoraReport);
	}

}
