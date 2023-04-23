package heartbeat.util;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class TimeUtil {

	public long getCurrentTimeMillis() {
		return System.currentTimeMillis();
	}

}
