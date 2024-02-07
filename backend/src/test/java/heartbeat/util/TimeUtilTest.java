package heartbeat.util;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.time.Instant;

class TimeUtilTest {

	@Test
	void shouldReturnTrueWhenTimeIsBeforeEndDate() {
		Instant mockEndDate = Instant.parse("2022-09-08T12:05:30Z");
		Instant mockTime = Instant.parse("2022-09-06T12:05:30Z");

		Assertions.assertTrue(TimeUtil.isBeforeAndEqual(mockEndDate, mockTime));
	}

	@Test
	void shouldReturnFalseWhenTimeIsAfterEndDate() {
		Instant mockEndDate = Instant.parse("2022-09-08T12:05:30Z");
		Instant mockTime = Instant.parse("2022-10-10T12:05:30Z");

		Assertions.assertFalse(TimeUtil.isBeforeAndEqual(mockEndDate, mockTime));
	}

	@Test
	void shouldReturnTrueWhenTimeIsAfterStartDate() {
		Instant mockStartDate = Instant.parse("2022-08-31T12:05:30Z");
		Instant mockTime = Instant.parse("2022-09-06T12:05:30Z");

		Assertions.assertTrue(TimeUtil.isAfterAndEqual(mockStartDate, mockTime));
	}

	@Test
	void shouldReturnFalseWhenTimeIsBeforeStartDate() {
		Instant mockStartDate = Instant.parse("2022-08-31T12:05:30Z");
		Instant mockTime = Instant.parse("2022-08-06T12:05:30Z");

		Assertions.assertFalse(TimeUtil.isAfterAndEqual(mockStartDate, mockTime));
	}

	@Test
	void shouldReturnZeroWhenInputZero() {
		double result = TimeUtil.convertMillisecondToMinutes(0d);
		Assertions.assertEquals(0d, result);
	}

	@Test
	void shouldReturnZeroWhenInputLessThan300() {
		double result = TimeUtil.convertMillisecondToMinutes(299d);
		Assertions.assertEquals(0d, result);
	}

	@Test
	void shouldReturnGreaterThanZeroWhenInputGreaterOrEqualThan300() {
		double result = TimeUtil.convertMillisecondToMinutes(300d);
		Assertions.assertEquals(0.01d, result);

		double result2 = TimeUtil.convertMillisecondToMinutes(600000d);
		Assertions.assertEquals(10d, result2);
	}

	@Test
	void shouldConvertTimeStampsToHoursMinutesSeconds() {
		String timeStamp = "1258436697";
		String result = TimeUtil.msToHMS(Long.parseLong(timeStamp));

		Assertions.assertEquals("349:33:56", result);
	}

	@Test
	void shouldCompareToDateString() {
		String preDateString = "2023-11-28T14:02:03.724+0800";
		String nextDateString = "2029-11-28T14:02:03.724+0800";
		int result = TimeUtil.compareToDateString(preDateString, nextDateString);

		Assertions.assertEquals(1, result);
	}

}
