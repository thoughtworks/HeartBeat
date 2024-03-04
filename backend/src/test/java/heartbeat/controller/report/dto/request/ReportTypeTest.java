package heartbeat.controller.report.dto.request;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.Assert.assertEquals;

class ReportTypeTest {

	@Test
	public void shouldConvertValueToType() {
		ReportType boardType = ReportType.fromValue("board");
		ReportType pipelineType = ReportType.fromValue("pipeline");
		ReportType metricType = ReportType.fromValue("metric");

		assertEquals(boardType, ReportType.BOARD);
		assertEquals(pipelineType, ReportType.PIPELINE);
		assertEquals(metricType, ReportType.METRIC);
	}

	@Test
	public void shouldThrowExceptionWhenDateTypeNotSupported() {
		assertThatThrownBy(() -> ReportType.fromValue("unknown")).isInstanceOf(IllegalArgumentException.class)
			.hasMessageContaining("ReportType not found!");
	}

}
