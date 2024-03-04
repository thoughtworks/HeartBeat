package heartbeat.controller.report.dto.request;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertEquals;

class MetricTypeTest {

	@Test
	public void shouldConvertValueToType() {
		MetricType boardType = MetricType.fromValue("board");
		MetricType doraType = MetricType.fromValue("dora");

		assertEquals(boardType, MetricType.BOARD);
		assertEquals(doraType, MetricType.DORA);
	}

	@Test
	public void shouldThrowExceptionWhenDateTypeNotSupported() {
		assertThatThrownBy(() -> MetricType.fromValue("unknown")).isInstanceOf(IllegalArgumentException.class)
			.hasMessageContaining("MetricType not found!");
	}

}
