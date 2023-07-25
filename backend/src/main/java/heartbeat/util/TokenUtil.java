package heartbeat.util;

public interface TokenUtil {

	static String mask(String token) {
		String prefix = token.substring(0, 4);
		String suffix = token.substring(token.length() - 4);
		return prefix + "*".repeat(Math.max(0, token.length() - 8)) + suffix;
	}

}
