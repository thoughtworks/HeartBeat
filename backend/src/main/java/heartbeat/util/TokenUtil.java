package heartbeat.util;

public class TokenUtil {

	public static String maskToken(String token) {
		String prefix = token.substring(0, 4);
		String suffix = token.substring(token.length() - 4);
		StringBuilder sb = new StringBuilder(prefix);
		for (int i = 4; i < token.length() - 4; i++) {
			sb.append("*");
		}
		sb.append(suffix);
		return sb.toString();
	}

}
