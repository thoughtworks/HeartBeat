package heartbeat.util;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TimeUtil {

	public long getCurrentTimeMillis() {
		return System.currentTimeMillis();
	}

}
