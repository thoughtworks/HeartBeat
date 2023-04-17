package heartbeat.service.source.github;

import heartbeat.client.GithubFeignClient;
import heartbeat.client.dto.codebase.github.GitHubOrganizationsInfo;
import heartbeat.client.dto.codebase.github.GitHubRepos;
import heartbeat.exception.CustomFeignClientException;
import heartbeat.exception.RequestFailedException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.LinkedHashSet;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class GithubServiceTest {

	@Mock
	GithubFeignClient githubFeignClient;

	@InjectMocks
	GithubService githubService;

	@Test
	void shouldReturnNonRedundantGithubReposWhenCallGithubFeignClientApi() {
		String githubToken = "123456";
		String token = "token " + githubToken;
		when(githubFeignClient.getAllRepos(token)).thenReturn(List.of(GitHubRepos.builder().html_url("11111").build(),
				GitHubRepos.builder().html_url("22222").build(), GitHubRepos.builder().html_url("33333").build()));

		when(githubFeignClient.getGithubOrganizationsInfo(token))
			.thenReturn(List.of(GitHubOrganizationsInfo.builder().login("org1").build(),
					GitHubOrganizationsInfo.builder().login("org2").build()));

		when(githubFeignClient.getReposByOrganizationName("org1", token))
			.thenReturn(List.of(GitHubRepos.builder().html_url("22222").build(),
					GitHubRepos.builder().html_url("33333").build(), GitHubRepos.builder().html_url("44444").build()));

		final var response = githubService.verifyToken(githubToken);

		assertThat(response.getGithubRepos()).hasSize(4);
		assertThat(response.getGithubRepos())
			.isEqualTo(new LinkedHashSet<>(List.of("11111", "22222", "33333", "44444")));
	}

	@Test
	void shouldReturnUnauthorizedStatusWhenCallGithubFeignClientApiWithWrongToken() {
		String wrongGithubToken = "123456";
		String token = "token " + wrongGithubToken;

		when(githubFeignClient.getAllRepos(token)).thenThrow(new CustomFeignClientException(401, "Bad credentials"));

		final var thrown = Assertions.assertThrows(RequestFailedException.class,
				() -> githubService.verifyToken(wrongGithubToken));

		assertThat(thrown.getMessage()).isEqualTo("Request failed with status code 401, error: Bad credentials");
	}

}
