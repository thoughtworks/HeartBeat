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
		try {
			log.info("[Github] Start to query repository_url by token: https://api.github.com/user/repos");
			List<String> githubReposByUser = githubFeignClient.getAllRepos(token)
				.stream()
				.map(GithubRepos::getHtml_url)
				.toList();
			log.info("[Github] Successfully queried repository_data by token");
			log.info("[Github] Start to query organization_url by token: https://api.github.com/user/orgs");

			List<GithubOrganizationsInfo> githubOrganizations = githubFeignClient.getGithubOrganizationsInfo(token);
			log.info("[Github] Successfully queried organization_data by token");

			List<String> githubRepos = new ArrayList<>(githubReposByUser);
			log.info(
					"[Github] Start to query repository_url by organization_name and token: https://api.github.com/orgs/{organization-name}/repos");

			getGithubReposByOrganizations(token, githubOrganizations, githubRepos);
			log.info("[Github] Successfully queried repository_data by organizations and token");
			log.info("[Github] Start to remove duplicate githubRepos list");
			removeDuplicates(githubRepos);
			log.info("[Github] Successfully remove duplicate githubRepos list");

			return GithubResponse.builder().githubRepos(githubRepos).build();
		}
		catch (FeignException e) {
			log.error("Failed when call Github with token", e);
			throw new RequestFailedException(e);
		}
	}

	private void getGithubReposByOrganizations(String token, List<GithubOrganizationsInfo> githubOrganizations,
			List<String> githubRepos) {
		githubRepos.addAll(githubOrganizations.stream()
			.map(GithubOrganizationsInfo::getLogin)
			.flatMap(org -> githubFeignClient.getReposByOrganizationName(org, token)
				.stream()
				.map(GithubRepos::getHtml_url))
			.toList());
	}

	private static void removeDuplicates(List<String> githubRepos) {
		LinkedHashSet<String> set = new LinkedHashSet<>(githubRepos);
		githubRepos.clear();
		githubRepos.addAll(set);
	}

}
