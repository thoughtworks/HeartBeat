package heartbeat.controller.report.dto.request;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertEquals;

class ReportTypeTest {

	@Test
	public void shouldConvertValueToType() {
		ReportType boardType = ReportType.fromValue("board");
		ReportType doraType = ReportType.fromValue("dora");

		assertEquals(boardType, ReportType.BOARD);
		assertEquals(doraType, ReportType.DORA);
	}

	@Test
	public void shouldThrowExceptionWhenDateTypeNotSupported() {
		assertThatThrownBy(() -> ReportType.fromValue("unknown")).isInstanceOf(IllegalArgumentException.class)
			.hasMessageContaining("ReportType not found!");
	}

}
