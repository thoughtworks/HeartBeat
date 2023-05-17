package heartbeat.util;

import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

class TimeUtilTest {

	@Test
	void shouldReturnTrueWhenTimeIsBeforeEndDate() {
		Instant mockEndDate = Instant.parse("2022-09-08T12:05:30Z");
		Instant mockTime = Instant.parse("2022-09-06T12:05:30Z");

		assertTrue(TimeUtil.isBeforeAndEqual(mockEndDate, mockTime));
	}

	@Test
	void shouldReturnFalseWhenTimeIsAfterEndDate() {
		Instant mockEndDate = Instant.parse("2022-09-08T12:05:30Z");
		Instant mockTime = Instant.parse("2022-10-10T12:05:30Z");

		assertFalse(TimeUtil.isBeforeAndEqual(mockEndDate, mockTime));
	}

	@Test
	void shouldReturnTrueWhenTimeIsAfterStartDate() {
		Instant mockStartDate = Instant.parse("2022-08-31T12:05:30Z");
		Instant mockTime = Instant.parse("2022-09-06T12:05:30Z");

		assertTrue(TimeUtil.isAfterAndEqual(mockStartDate, mockTime));
	}

	@Test
	void shouldReturnFalseWhenTimeIsBeforeStartDate() {
		Instant mockStartDate = Instant.parse("2022-08-31T12:05:30Z");
		Instant mockTime = Instant.parse("2022-08-06T12:05:30Z");

		assertFalse(TimeUtil.isAfterAndEqual(mockStartDate, mockTime));
	}

}
