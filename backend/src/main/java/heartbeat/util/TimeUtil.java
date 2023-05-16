package heartbeat.util;

import java.time.Instant;

public interface TimeUtil {

	static boolean isBeforeAndEqual(Instant endDate, Instant time) {
		return time.compareTo(endDate) <= 0;
	}

	static boolean isAfterAndEqual(Instant startDate, Instant time) {
		return time.compareTo(startDate) >= 0;
	}

}
