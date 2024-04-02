package heartbeat.tools;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

public class TimeUtils {

	public static Long mockTimeStamp(int year, int month, int day, int hour, int minute, int second) {
		return LocalDateTime.of(year, month, day, hour, minute, second).toInstant(ZoneOffset.UTC).toEpochMilli();
	}

}
