package heartbeat.util;

public interface GithubUtil {

	static String getGithubUrlFullName(String url) {
		if (url  == null) {
			return "";
		} else {
			return url.replaceFirst("^(.*?github.com/)", "").replaceFirst("(\\.git)?$", "");
		}
	}

}
