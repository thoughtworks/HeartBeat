package heartbeat.util;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class SystemUtil {

	public Map<String, String> getEnvMap() {
		return System.getenv();
	}

}
