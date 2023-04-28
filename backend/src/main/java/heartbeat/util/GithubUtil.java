package heartbeat.util;

public class GithubUtil {
	public static String getGithubUrlFullName(String url) {
		return url.replaceFirst("^(.*?github.com/)", "").replaceFirst("(\\.git)?$", "");
	}
}
