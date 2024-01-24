package heartbeat.controller.report;

import heartbeat.config.DataType;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class DataTypeTest {

	@Test
	public void shouldConvertValueToType() {
		DataType metricType = DataType.fromValue("metric");
		DataType boardType = DataType.fromValue("board");
		DataType pipelineType = DataType.fromValue("pipeline");

		assertEquals(metricType, DataType.METRIC);
		assertEquals(boardType, DataType.BOARD);
		assertEquals(pipelineType, DataType.PIPELINE);
	}

	@Test
	public void shouldThrowExceptionWhenDateTypeNotSupported() {
		assertThatThrownBy(() -> DataType.fromValue("unknown")).isInstanceOf(IllegalArgumentException.class)
			.hasMessageContaining("Data type does not find!");
	}

}
