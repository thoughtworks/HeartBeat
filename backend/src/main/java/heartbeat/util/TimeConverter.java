package heartbeat.util;

public class TimeConverter {

	public static Double convertMillisecondToMinutes(Double millisecond) {
		return Math.round((millisecond / 1000 / 60) * 100.0) / 100.0;
	}

}
