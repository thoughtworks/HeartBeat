package heartbeat.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TimeConverterTest {

	@Test
	void shouldReturnZeroWhenInputZero() {
		double result = TimeConverter.convertMillisecondToMinutes(0d);
		assertEquals(0d, result);
	}

	@Test
	void shouldReturnZeroWhenInputLessThan300() {
		double result = TimeConverter.convertMillisecondToMinutes(299d);
		assertEquals(0d, result);
	}

	@Test
	void shouldReturnGreaterThanZeroWhenInputGreaterOrEqualThan300() {
		double result = TimeConverter.convertMillisecondToMinutes(300d);
		assertEquals(0.01d, result);

		double result2 = TimeConverter.convertMillisecondToMinutes(600000d);
		assertEquals(10d, result2);
	}

}
