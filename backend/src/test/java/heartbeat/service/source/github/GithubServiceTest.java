package heartbeat.service.source.github;

import heartbeat.client.GitHubFeignClient;
import heartbeat.client.dto.codebase.github.GitHubOrganizationsInfo;
import heartbeat.client.dto.codebase.github.GitHubRepo;
import heartbeat.exception.CustomFeignClientException;
import heartbeat.exception.RequestFailedException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.concurrent.CompletionException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class GithubServiceTest {

	@Mock
	GitHubFeignClient gitHubFeignClient;

	@InjectMocks
	GitHubService githubService;

	ThreadPoolTaskExecutor executor;

	@BeforeEach
	public void setUp() {
		githubService = new GitHubService(executor = getTaskExecutor(), gitHubFeignClient);
	}

	@AfterEach
	public void tearDown() {
		executor.shutdown();
	}

	public ThreadPoolTaskExecutor getTaskExecutor() {
		ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
		executor.setCorePoolSize(10);
		executor.setMaxPoolSize(100);
		executor.setQueueCapacity(500);
		executor.setKeepAliveSeconds(60);
		executor.setThreadNamePrefix("Heartbeat-");
		executor.initialize();
		return executor;
	}

	@Test
	void shouldReturnNonRedundantGithubReposWhenCallGithubFeignClientApi() {
		String githubToken = "123456";
		String token = "token " + githubToken;
		when(gitHubFeignClient.getAllRepos(token)).thenReturn(List.of(GitHubRepo.builder().htmlUrl("11111").build(),
				GitHubRepo.builder().htmlUrl("22222").build(), GitHubRepo.builder().htmlUrl("33333").build()));

		when(gitHubFeignClient.getGithubOrganizationsInfo(token))
			.thenReturn(List.of(GitHubOrganizationsInfo.builder().login("org1").build(),
					GitHubOrganizationsInfo.builder().login("org2").build()));

		when(gitHubFeignClient.getReposByOrganizationName("org1", token))
			.thenReturn(List.of(GitHubRepo.builder().htmlUrl("22222").build(),
					GitHubRepo.builder().htmlUrl("33333").build(), GitHubRepo.builder().htmlUrl("44444").build()));

		final var response = githubService.verifyToken(githubToken);
		githubService.shutdownExecutor();
		assertThat(response.getGithubRepos()).hasSize(4);
		assertThat(response.getGithubRepos())
			.isEqualTo(new LinkedHashSet<>(List.of("11111", "22222", "33333", "44444")));
	}

	@Test
	void shouldReturnUnauthorizedStatusWhenCallGithubFeignClientApiWithWrongToken() {
		String wrongGithubToken = "123456";
		String token = "token " + wrongGithubToken;

		when(gitHubFeignClient.getAllRepos(token)).thenThrow(new CustomFeignClientException(401, "Bad credentials"));

		final var thrown = Assertions.assertThrows(RequestFailedException.class,
				() -> githubService.verifyToken(wrongGithubToken));

		assertThat(thrown.getMessage()).isEqualTo("Request failed with status code 401, error: Bad credentials");
	}

	@Test
	void shouldThrowExceptionWhenVerifyGitHubThrowUnExpectedException() {

		when(gitHubFeignClient.getAllRepos(anyString()))
			.thenThrow(new CompletionException(new Exception("UnExpected Exception")));
		when(gitHubFeignClient.getGithubOrganizationsInfo(anyString()))
			.thenThrow(new CompletionException(new Exception("UnExpected Exception")));
		when(gitHubFeignClient.getReposByOrganizationName(anyString(), anyString()))
			.thenThrow(new CompletionException(new Exception("UnExpected Exception")));

		assertThatThrownBy(() -> githubService.verifyToken("mockToken")).isInstanceOf(CompletionException.class)
			.hasMessageContaining("UnExpected Exception");
	}

}
