package heartbeat.util;

import org.apache.commons.lang3.tuple.Pair;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.List;

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

	@Test
	void testFormatDecimalTwo_Float_ZeroValue() {
		double value = 0F;
		String expected = "0";

		String result = DecimalUtil.formatDecimalTwo(value);

		Assertions.assertEquals(expected, result);
	}

	@Test
	void testFormatDecimalTwo_Float_MultipleDecimal() {
		double value = 10.25671F;
		String expected = "10.26";

		String result = DecimalUtil.formatDecimalTwo(value);

		Assertions.assertEquals(expected, result);
	}

	@Test
	void testFormatDecimalTwo_Float_NonZeroDecimal() {
		double value = 10.25F;
		String expected = "10.25";

		String result = DecimalUtil.formatDecimalTwo(value);

		Assertions.assertEquals(expected, result);
	}

	@Test
	void shouldReturnZeroWhenCallFormatDecimalTwoGivenFloatValue() {
		double value = 0.00005F;
		String expected = "0";

		String result = DecimalUtil.formatDecimalTwo(value);

		Assertions.assertEquals(expected, result);
	}

	@Test
	void testFormatDecimalFour_ZeroValue() {
		double value = 0;
		String expected = "0.0000";

		String result = DecimalUtil.formatDecimalFour(value);

		Assertions.assertEquals(expected, result);
	}

	@Test
	void testFormatDecimalFour_NonZeroValue() {
		List<Pair<Double, String>> value = List.of(Pair.of(10.25671, "10.2567"), Pair.of(10.25, "10.2500"),
				Pair.of(0.000006, "0.0000"));

		List<String> result = List.of(DecimalUtil.formatDecimalFour(value.get(0).getLeft()),
				DecimalUtil.formatDecimalFour(value.get(1).getLeft()),
				DecimalUtil.formatDecimalFour(value.get(2).getLeft()));

		Assertions.assertEquals(value.get(0).getRight(), result.get(0));
		Assertions.assertEquals(value.get(1).getRight(), result.get(1));
		Assertions.assertEquals(value.get(2).getRight(), result.get(2));
	}

}
