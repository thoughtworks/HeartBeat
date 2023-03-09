package heartbeat.service.source.github;

import feign.FeignException;
import heartbeat.client.GithubFeignClient;
import heartbeat.client.dto.GithubOrganizationsInfo;
import heartbeat.client.dto.GithubRepos;
import heartbeat.controller.source.vo.GithubResponse;
import heartbeat.exception.RequestFailedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class GithubService {

	private final GithubFeignClient githubFeignClient;

	public GithubResponse verifyToken(String githubToken) {
		String token = "token " + githubToken;
		String partialToken = githubToken.substring(0, 10);
		try {
			log.info("[Github] Start to query repository_url by token, token: " + partialToken);
			List<String> githubReposByUser = githubFeignClient.getAllRepos(token)
				.stream()
				.map(GithubRepos::getHtml_url)
				.toList();
			log.info("[Github] Successfully get repository_url by token, token: " + partialToken + " repos: "
					+ githubReposByUser);

			log.info("[Github] Start to query organization_url by token, token: " + partialToken);
			List<GithubOrganizationsInfo> githubOrganizations = githubFeignClient.getGithubOrganizationsInfo(token);
			log.info("[Github] Successfully get organizations by token, token: " + partialToken + " organizations: "
					+ githubOrganizations);

			LinkedHashSet<String> githubRepos = new LinkedHashSet<>(githubReposByUser);

			log.info("[Github] Start to query repository_url by organization_name and token, token: " + partialToken);
			getAllGithubRepos(token, githubOrganizations, githubRepos);
			log.info("[Github] Successfully get all repository_url, token: " + partialToken + " repos: " + githubRepos);

			return GithubResponse.builder().githubRepos(githubRepos).build();
		}
		catch (FeignException e) {
			log.error("Failed when call Github with token", e);
			throw new RequestFailedException(e);
		}
	}

	private void getAllGithubRepos(String token, List<GithubOrganizationsInfo> githubOrganizations,
			LinkedHashSet<String> githubRepos) {
		githubRepos.addAll(githubOrganizations.stream()
			.map(GithubOrganizationsInfo::getLogin)
			.flatMap(org -> githubFeignClient.getReposByOrganizationName(org, token)
				.stream()
				.map(GithubRepos::getHtml_url))
			.collect(Collectors.toSet()));
	}

}
