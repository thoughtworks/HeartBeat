package heartbeat.util;

public interface GithubUtil {

	static String getGithubUrlFullName(String url) {
		if (url == null) {
			return "";
		}
		if (url.startsWith("https://")) {
			return url.replaceFirst("^(.*?github.com/)", "").replaceFirst("(\\.git)?$", "");
		}
		else {
			return url.replaceFirst("^(.*?:)", "").replaceFirst("(\\.git)?$", "");
		}
	}

}
