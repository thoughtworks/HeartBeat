package heartbeat.util;

import java.util.function.Function;

public interface ValueUtil {

	static <T, R> R getValueOrNull(T object, Function<T, R> getter) {
		return object != null ? getter.apply(object) : null;
	}

	static <T> T valueOrDefault(T defaultValue, T value) {
		return value == null ? defaultValue : value;
	}

}
