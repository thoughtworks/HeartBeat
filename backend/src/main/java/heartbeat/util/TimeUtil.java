package heartbeat.util;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

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

	static String convertToISOFormat(String timestamp) {
		Instant instant = Instant.ofEpochMilli(Long.parseLong(timestamp));
		LocalDateTime dateTime = LocalDateTime.ofInstant(instant, ZoneId.of("UTC"));
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'");
		return dateTime.format(formatter);

	}

	static String msToHMS(long s) {
		long ms = s % 1000;
		s = (s - ms) / 1000;
		long seconds = s % 60;
		s = (s - seconds) / 60;
		long minutes = s % 60;
		long hours = (s - minutes) / 60;

		return hours + ":" + minutes + ":" + seconds;
	}

}
