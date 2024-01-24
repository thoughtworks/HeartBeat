package heartbeat.controller.report.dto.request;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.Assert.assertEquals;

class ReportDataTypeTest {

	@Test
	public void shouldConvertValueToType() {
		ReportDataType boardType = ReportDataType.fromValue("board");
		ReportDataType pipelineType = ReportDataType.fromValue("pipeline");
		ReportDataType metricType = ReportDataType.fromValue("metric");

		assertEquals(boardType, ReportDataType.BOARD);
		assertEquals(pipelineType, ReportDataType.PIPELINE);
		assertEquals(metricType, ReportDataType.METRIC);
	}

	@Test
	public void shouldThrowExceptionWhenDateTypeNotSupported() {
		assertThatThrownBy(() -> ReportDataType.fromValue("unknown")).isInstanceOf(IllegalArgumentException.class)
			.hasMessageContaining("ReportType not found!");
	}

}
