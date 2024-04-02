package heartbeat.service.report.calculator;

import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.request.MetricType;
import heartbeat.service.report.GenerateReporterService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.Map;
import java.util.function.Consumer;

import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class ReportGeneratorTest {

	@InjectMocks
	private ReportGenerator reportGenerator;

	@Mock
	private GenerateReporterService generateReporterService;

	@Test
	void shouldSuccessGetReportGeneratorMapWhenCallGetReportGenerator() {

		Map<MetricType, Consumer<GenerateReportRequest>> generator = reportGenerator
			.getReportGenerator(generateReporterService);

		assertTrue(generator.containsKey(MetricType.BOARD));
		assertTrue(generator.containsKey(MetricType.DORA));

	}

}
