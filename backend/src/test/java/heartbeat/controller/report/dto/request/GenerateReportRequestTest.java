package heartbeat.controller.report.dto.request;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.List;

public class GenerateReportRequestTest {

	private static final List<String> METRICS = List.of(MetricEnum.VELOCITY.getValue(),
			MetricEnum.DEPLOYMENT_FREQUENCY.getValue(), MetricEnum.LEAD_TIME_FOR_CHANGES.getValue());

	private static final List<String> UPPER_METRICS = List.of("VELOCITY", "DEPLOYMENT FREQUENCY",
			"LEAD TIME FOR CHANGES");

	private final GenerateReportRequest request = GenerateReportRequest.builder()
		.metrics(UPPER_METRICS)
		.csvTimeStamp("123456789")
		.startTime("1710000000000")
		.endTime("1712678399999")
		.build();

	@Test
	void shouldReturnAllTheMetrics() {
		List<String> result = request.getMetrics();

		Assertions.assertEquals(METRICS, result);
	}

	@Test
	void shouldReturnRelatedMetrics() {
		List<String> boardMetrics = request.getBoardMetrics();
		List<String> pipelineMetrics = request.getPipelineMetrics();
		List<String> sourceControlMetrics = request.getSourceControlMetrics();

		Assertions.assertEquals(List.of("velocity"), boardMetrics);
		Assertions.assertEquals(List.of("deployment frequency"), pipelineMetrics);
		Assertions.assertEquals(List.of("lead time for changes"), sourceControlMetrics);
	}

	@Test
	void shouldReturnRelatedReportId() {
		String boardReportId = request.getBoardReportFileId();
		String pipelineReportId = request.getPipelineReportFileId();
		String sourceControlReportId = request.getSourceControlReportFileId();

		Assertions.assertEquals("board-20240310-20240409-123456789", boardReportId);
		Assertions.assertEquals("pipeline-20240310-20240409-123456789", pipelineReportId);
		Assertions.assertEquals("sourceControl-20240310-20240409-123456789", sourceControlReportId);
	}

}
