package heartbeat.client;

import heartbeat.client.dto.GithubOrgsInfo;
import heartbeat.client.dto.GithubRepos;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;

@FeignClient(value = "githubFeignClient", url = "https://api.github.com")
public interface GithubFeignClient {

	@GetMapping(path = "/user/orgs")
	@ResponseStatus(HttpStatus.OK)
	List<GithubOrgsInfo> getGithubOrgsInfo(@RequestHeader("Authorization") String token);

	@GetMapping(path = "/user/repos")
	@ResponseStatus(HttpStatus.OK)
	List<GithubRepos> getAllRepos(@RequestHeader("Authorization") String token);

	@GetMapping(path = "/orgs/{organizationName}/repos")
	@ResponseStatus(HttpStatus.OK)
	GithubRepos getReposByOrganizationName(@PathVariable String organizationName,
			@RequestHeader("Authorization") String token);

}
