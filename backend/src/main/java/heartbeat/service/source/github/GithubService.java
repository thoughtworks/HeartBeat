package heartbeat.service.source.github;

import heartbeat.client.GithubFeignClient;
import heartbeat.client.dto.GithubOrgsInfo;
import heartbeat.client.dto.GithubRepos;
import heartbeat.controller.source.vo.GithubResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@Log4j2
public class GithubService {

	private final GithubFeignClient githubFeignClient;

	public GithubResponse verifyToken(String githubToken) {
		String token = "token " + githubToken;
		final var githubReposByUser = githubFeignClient.getAllRepos(token)
			.stream()
			.map(GithubRepos::getHtml_url)
			.toList();
		final var githubOrganizations = githubFeignClient.getGithubOrgsInfo(token);
		List<String> githubRepos = new ArrayList<>(githubReposByUser);
		githubRepos.addAll(githubOrganizations.stream()
			.map(GithubOrgsInfo::getLogin)
			.flatMap(org -> githubFeignClient.getReposByOrganizationName(org, token)
				.stream()
				.map(GithubRepos::getHtml_url))
			.toList());
		log.info(githubRepos);

		removeDuplicates(githubRepos);

		log.info(githubRepos);

		return GithubResponse.builder().githubRepos(githubRepos).build();
	}

	private static void removeDuplicates(List<String> githubRepos) {
		LinkedHashSet<String> set = new LinkedHashSet<>(githubRepos);
		githubRepos.clear();
		githubRepos.addAll(set);
	}

}
