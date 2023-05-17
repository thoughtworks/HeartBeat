package heartbeat.util;

public interface GithubUtil {

	public static String getGithubUrlFullName(String url) {
		return url.replaceFirst("^(.*?github.com/)", "").replaceFirst("(\\.git)?$", "");
	}

}
