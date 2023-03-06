package heartbeat.service.source.github;

import heartbeat.client.GithubFeignClient;
import heartbeat.client.dto.GithubOrgsInfo;
import heartbeat.controller.source.vo.GithubResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class GithubVerifyService {
	private final GithubFeignClient githubFeignClient;
	public GithubResponse verifyToken(String githubToken) {
		String token = "token " + githubToken;
		final var githubOrgsInfo = githubFeignClient.getGithubOrgsInfo(token);
		System.out.println(githubOrgsInfo.stream().map(GithubOrgsInfo::getLogin).collect(Collectors.toList()));

		return GithubResponse.builder().githubRepos(List.of("https://github.com/xxxx1/repo1","https://github.com/xxxx2/repo2")).build();
	}
}
