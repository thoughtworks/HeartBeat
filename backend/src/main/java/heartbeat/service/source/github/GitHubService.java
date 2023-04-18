package heartbeat.service.source.github;

import feign.FeignException;
import heartbeat.client.GitHubFeignClient;
import heartbeat.client.dto.codebase.github.GitHubOrganizationsInfo;
import heartbeat.client.dto.codebase.github.GitHubRepos;
import heartbeat.controller.source.dto.GitHubResponse;
import heartbeat.exception.RequestFailedException;
import heartbeat.util.TokenUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class GitHubService {

	private final GitHubFeignClient gitHubFeignClient;

	public GitHubResponse verifyToken(String githubToken) {
		String token = "token " + githubToken;
		String maskToken = TokenUtil.mask(token);
		try {
			log.info("Start to query repository_url by token, token: {}", maskToken);
			List<String> githubReposByUser = gitHubFeignClient.getAllRepos(token)
				.stream()
				.map(GitHubRepos::getHtml_url)
				.toList();
			log.info("Successfully get repository_token: {}, githubReposByUser: {}", maskToken, githubReposByUser);

			log.info("Start to query organizations_token: {}", maskToken);
			List<GitHubOrganizationsInfo> githubOrganizations = gitHubFeignClient.getGithubOrganizationsInfo(token);
			log.info("Successfully get organizations_token: {} organizations: {}", maskToken, githubOrganizations);

			LinkedHashSet<String> githubRepos = new LinkedHashSet<>(githubReposByUser);
			Set<String> githubReposByOrganizations = getAllGitHubRepos(token, githubOrganizations);
			githubRepos.addAll(githubReposByOrganizations);
			return GitHubResponse.builder().githubRepos(githubRepos).build();
		}
		catch (FeignException e) {
			log.error("Failed to call Github with token_error: {}", e);
			throw new RequestFailedException(e);
		}
	}

	private Set<String> getAllGitHubRepos(String token, List<GitHubOrganizationsInfo> gitHubOrganizations) {
		String maskToken = TokenUtil.mask(token);
		log.info("Start to query repository by organization_token: {}, gitHubOrganizations: {}", maskToken,
				gitHubOrganizations);
		Set<String> allGitHubRepos = gitHubOrganizations.stream()
			.map(GitHubOrganizationsInfo::getLogin)
			.flatMap(org -> gitHubFeignClient.getReposByOrganizationName(org, token)
				.stream()
				.map(GitHubRepos::getHtml_url))
			.collect(Collectors.toSet());
		log.info("Successfully get all repositories_token: {}, repos: {}", maskToken, allGitHubRepos);
		return allGitHubRepos;

	}

}
