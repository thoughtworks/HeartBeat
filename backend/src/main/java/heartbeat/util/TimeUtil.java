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

	static String convertToSimpleISOFormat(Long timestamp) {
		LocalDateTime dateTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(timestamp), ZoneId.of("UTC"));
		return dateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
	}

	static String convertToChinaSimpleISOFormat(Long timestamp) {
		LocalDateTime dateTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(timestamp), ZoneId.of("Asia/Shanghai"));
		return dateTime.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
	}

	static String msToHMS(long timeStamp) {
		long tempTimeStamp = timeStamp;
		long milliseconds = tempTimeStamp % 1000;
		tempTimeStamp = (tempTimeStamp - milliseconds) / 1000;
		long seconds = tempTimeStamp % 60;
		tempTimeStamp = (tempTimeStamp - seconds) / 60;
		long minutes = tempTimeStamp % 60;
		long hours = (tempTimeStamp - minutes) / 60;

		return hours + ":" + minutes + ":" + seconds;
	}

}
