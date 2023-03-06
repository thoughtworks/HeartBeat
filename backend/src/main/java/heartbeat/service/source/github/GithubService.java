package heartbeat.service.source.github;

import heartbeat.client.GithubFeignClient;
import heartbeat.client.dto.GithubRepos;
import heartbeat.controller.source.vo.GithubResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class GithubService {
	private final GithubFeignClient githubFeignClient;
	public GithubResponse verifyToken(String githubToken) {
		String token = "token " + githubToken;
		final var githubRepos = githubFeignClient.getAllRepos(token);

		return GithubResponse.builder()
			.githubRepos(githubRepos.stream().map(GithubRepos::getHtml_url).toList()).build();
	}
}
