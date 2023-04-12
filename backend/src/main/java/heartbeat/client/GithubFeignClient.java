package heartbeat.client;

import heartbeat.client.dto.GithubOrganizationsInfo;
import heartbeat.client.dto.GithubRepos;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;

@FeignClient(name = "githubFeignClient", url = "${github.url}")
public interface GithubFeignClient {

	@GetMapping(path = "/user/orgs")
	@ResponseStatus(HttpStatus.OK)
	List<GithubOrganizationsInfo> getGithubOrganizationsInfo(@RequestHeader("Authorization") String token);

	@GetMapping(path = "/user/repos")
	@ResponseStatus(HttpStatus.OK)
	List<GithubRepos> getAllRepos(@RequestHeader("Authorization") String token);

	@GetMapping(path = "/orgs/{organizationName}/repos")
	@ResponseStatus(HttpStatus.OK)
	List<GithubRepos> getReposByOrganizationName(@PathVariable String organizationName,
			@RequestHeader("Authorization") String token);

}
