package heartbeat.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class GithubUtilTest {

	@Test
	void shouldReturnEmptyWhenInputGithubRepoIsNull() {
		String result = GithubUtil.getGithubUrlFullName(null);
		assertEquals("", result);
	}

	@Test
	void shouldReturnRepositoryFullNameWhenInputGithubRepo() {
		String result = GithubUtil.getGithubUrlFullName("https://github.com/XXXX-fs/fs-platform-onboarding");
		assertEquals("XXXX-fs/fs-platform-onboarding", result);
	}

	@Test
	void shouldReturnInputWhenInputIsNotGithubRepo() {
		String result = GithubUtil.getGithubUrlFullName("https://notgdithdub.com/XXXX-fs/fs-platform-onboarding");
		assertEquals("https://notgdithdub.com/XXXX-fs/fs-platform-onboarding", result);
	}

	@Test
	void shouldReturnInputWhenInputIsNotStartWithHttps() {
		String result = GithubUtil.getGithubUrlFullName("git@github.com:au-heartbeat/Heartbeat.git");
		assertEquals("au-heartbeat/Heartbeat", result);
	}

}
