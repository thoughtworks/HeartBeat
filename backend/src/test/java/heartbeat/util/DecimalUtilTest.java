package heartbeat.util;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class DecimalUtilTest {

	@Test
	void testFormatDecimalTwo_ZeroValue() {
		double value = 0;
		String expected = "0";

		String result = DecimalUtil.formatDecimalTwo(value);

		Assertions.assertEquals(expected, result);
	}

	@Test
	void testFormatDecimalTwo_MultipleDecimal() {
		double value = 10.25671;
		String expected = "10.26";

		String result = DecimalUtil.formatDecimalTwo(value);

		Assertions.assertEquals(expected, result);
	}

	@Test
	void testFormatDecimalTwo_NonZeroDecimal() {
		double value = 10.25;
		String expected = "10.25";

		String result = DecimalUtil.formatDecimalTwo(value);

		Assertions.assertEquals(expected, result);
	}

	@Test
	void shouldReturnZeroWhenCallFormatDecimalTwo() {
		double value = 0.00005;
		String expected = "0";

		String result = DecimalUtil.formatDecimalTwo(value);

		Assertions.assertEquals(expected, result);
	}

}
