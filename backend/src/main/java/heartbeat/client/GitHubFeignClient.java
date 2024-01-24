package heartbeat.client;

import heartbeat.client.decoder.GitHubFeignClientDecoder;
import heartbeat.client.dto.codebase.github.CommitInfo;
import heartbeat.client.dto.codebase.github.PullRequestInfo;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;

@FeignClient(name = "githubFeignClient", url = "${github.url}", configuration = GitHubFeignClientDecoder.class)
public interface GitHubFeignClient {

	@GetMapping(path = "/octocat")
	void verifyToken(@RequestHeader("Authorization") String token);

	@GetMapping(path = "/repos/{repository}/branches/{branchName}")
	void verifyCanReadTargetBranch(@PathVariable String repository, @PathVariable String branchName,
			@RequestHeader("Authorization") String token);

	@Cacheable(cacheNames = "commitInfo", key = "#repository+'-'+#commitId+'-'+#token")
	@GetMapping(path = "/repos/{repository}/commits/{commitId}")
	@ResponseStatus(HttpStatus.OK)
	CommitInfo getCommitInfo(@PathVariable String repository, @PathVariable String commitId,
			@RequestHeader("Authorization") String token);

	@Cacheable(cacheNames = "pullRequestCommitInfo", key = "#repository+'-'+#mergedPullNumber+'-'+#token")
	@GetMapping(path = "/repos/{repository}/pulls/{mergedPullNumber}/commits")
	@ResponseStatus(HttpStatus.OK)
	List<CommitInfo> getPullRequestCommitInfo(@PathVariable String repository, @PathVariable String mergedPullNumber,
			@RequestHeader("Authorization") String token);

	@Cacheable(cacheNames = "pullRequestListInfo", key = "#repository+'-'+#deployId+'-'+#token")
	@GetMapping(path = "/repos/{repository}/commits/{deployId}/pulls")
	@ResponseStatus(HttpStatus.OK)
	List<PullRequestInfo> getPullRequestListInfo(@PathVariable String repository, @PathVariable String deployId,
			@RequestHeader("Authorization") String token);

}
