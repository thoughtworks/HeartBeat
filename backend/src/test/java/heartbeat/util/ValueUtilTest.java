package heartbeat.util;

import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.controller.report.dto.response.Velocity;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class ValueUtilTest {

	@Test
	void shouldGetValueWhenObjectIsNotNull() {
		Velocity velocity = Velocity.builder().velocityForCards(10).velocityForSP(10).build();
		ReportResponse response = ReportResponse.builder().velocity(velocity).build();

		Velocity result = ValueUtil.getValueOrNull(response, ReportResponse::getVelocity);

		Assertions.assertEquals(velocity, result);
	}

	@Test
	void shouldGetNullWhenObjectIsNull() {
		Velocity result = ValueUtil.getValueOrNull(null, ReportResponse::getVelocity);

		Assertions.assertEquals(null, result);
	}

	@Test
	void shouldReturnDefaultValueGivenNewValueIsNull() {
		String defaultValue = "default";

		String result = ValueUtil.valueOrDefault(defaultValue, null);

		Assertions.assertEquals(defaultValue, result);
	}

	@Test
	void shouldReturnNewValueGivenNewValueIsNotNull() {
		String defaultValue = "default";
		String newValue = "new";

		String result = ValueUtil.valueOrDefault(defaultValue, newValue);

		Assertions.assertEquals(newValue, result);
	}

}
