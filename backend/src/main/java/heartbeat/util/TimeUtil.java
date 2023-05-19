package heartbeat.util;

import java.time.Instant;

public interface TimeUtil {

	static Double convertMillisecondToMinutes(Double millisecond) {
		return Math.round((millisecond / 1000 / 60) * 100.0) / 100.0;
	}

	static boolean isBeforeAndEqual(Instant endDate, Instant time) {
		return time.compareTo(endDate) <= 0;
	}

	static boolean isAfterAndEqual(Instant startDate, Instant time) {
		return time.compareTo(startDate) >= 0;
	}

}
