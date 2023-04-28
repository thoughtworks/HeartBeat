package heartbeat.service.source.github;

import feign.FeignException;
import heartbeat.client.GitHubFeignClient;
import heartbeat.client.dto.codebase.github.CommitInfo;
import heartbeat.client.dto.codebase.github.GitHubOrganizationsInfo;
import heartbeat.client.dto.codebase.github.GitHubRepo;
import heartbeat.client.dto.codebase.github.LeadTime;
import heartbeat.client.dto.codebase.github.PipelineLeadTime;
import heartbeat.client.dto.codebase.github.PullRequestInfo;
import heartbeat.client.dto.pipeline.buildkite.DeployInfo;
import heartbeat.client.dto.pipeline.buildkite.DeployTimes;
import heartbeat.controller.source.dto.GitHubResponse;
import heartbeat.exception.RequestFailedException;
import heartbeat.service.source.github.model.PipelineInfoOfRepository;
import heartbeat.util.GithubUtil;
import heartbeat.util.TokenUtil;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class GitHubService {

	@Autowired
	private final ThreadPoolTaskExecutor taskExecutor;

	private final GitHubFeignClient gitHubFeignClient;

	@PreDestroy
	public void shutdownExecutor() {
		taskExecutor.shutdown();
	}

	public GitHubResponse verifyToken(String githubToken) {
		try {
			String token = "token " + githubToken;
			String maskToken = TokenUtil.mask(token);
			log.info("Start to query repository_url by token, token: {}", maskToken);
			CompletableFuture<List<GitHubRepo>> githubReposByUserFuture = CompletableFuture
				.supplyAsync(() -> gitHubFeignClient.getAllRepos(token), taskExecutor);

			log.info("Start to query organizations_token: {}", maskToken);
			CompletableFuture<List<GitHubOrganizationsInfo>> githubOrganizationsFuture = CompletableFuture
				.supplyAsync(() -> gitHubFeignClient.getGithubOrganizationsInfo(token), taskExecutor);

			return githubReposByUserFuture
				.thenCombineAsync(githubOrganizationsFuture, (githubReposByUser, githubOrganizations) -> {
					log.info("Successfully get repository_token: {}, githubReposByUser: {}", maskToken,
							githubReposByUser);
					log.info("Successfully get organizations_token: {} organizations: {}", maskToken,
							githubOrganizations);
					List<String> githubReposMapped = githubReposByUser.stream().map(GitHubRepo::getHtmlUrl).toList();
					LinkedHashSet<String> githubRepos = new LinkedHashSet<>(githubReposMapped);
					CompletableFuture<Set<String>> githubReposByOrganizations = getAllGitHubReposAsync(token,
							githubOrganizations);
					Set<String> allGitHubRepos = githubReposByOrganizations.join();
					log.info("Successfully get all repositories_token: {}, repos: {}", maskToken, allGitHubRepos);
					githubRepos.addAll(allGitHubRepos);
					return GitHubResponse.builder().githubRepos(githubRepos).build();
				}, taskExecutor)
				.join();
		}
		catch (CompletionException e) {
			Throwable cause = e.getCause();
			log.error("Failed to call GitHub with token_error ", cause);
			if (cause instanceof FeignException feignException) {
				throw new RequestFailedException(feignException);
			}
			throw e;
		}
	}

	private CompletableFuture<Set<String>> getAllGitHubReposAsync(String token,
			List<GitHubOrganizationsInfo> gitHubOrganizations) {
		String maskToken = TokenUtil.mask(token);
		List<CompletableFuture<List<String>>> repoFutures = gitHubOrganizations.stream()
			.map(GitHubOrganizationsInfo::getLogin)
			.map(org -> CompletableFuture.supplyAsync(() -> {
				log.info("Start to query repository by organization_token: {}, gitHubOrganization: {}", maskToken, org);
				List<String> repos = gitHubFeignClient.getReposByOrganizationName(org, token)
					.stream()
					.map(GitHubRepo::getHtmlUrl)
					.toList();
				log.info("End to queried repository by organization_token: {}, gitHubOrganization: {}", maskToken, org);
				return repos;
			}, taskExecutor))
			.toList();
		return CompletableFuture.allOf(repoFutures.toArray(new CompletableFuture[0]))
			.thenApply(v -> repoFutures.stream()
				.map(CompletableFuture::join)
				.flatMap(Collection::stream)
				.collect(Collectors.toSet()));
	}

	public CompletableFuture<List<PipelineLeadTime>> fetchPipelinesLeadTime(List<DeployTimes> deployTimes,
			Map<String, String> repositories) {
		return CompletableFuture.supplyAsync(() -> {
			ArrayList<PipelineLeadTime> pipelineLeadTimes = new ArrayList<>();
			deployTimes.stream().map(deployTime -> {
				String repository = GithubUtil.getGithubUrlFullName(repositories.get(deployTime.getPipelineId()));
				return PipelineInfoOfRepository.builder()
					.repository(repository)
					.passedDeploy(deployTime.getPassed())
					.pipelineStep(deployTime.getPipelineStep())
					.pipelineName(deployTime.getPipelineName())
					.build();
			}).map(item -> {
				List<DeployInfo> passedDeployInfos = item.getPassedDeploy();
				// TODO: need token
				String fakeToke = "Token";
				List<LeadTime> leadTimes = passedDeployInfos.stream().map(deployInfo -> {
					try {
						List<PullRequestInfo> pullRequestInfos = CompletableFuture
							.supplyAsync(() -> gitHubFeignClient.getPullRequestListInfo(item.getRepository(),
									deployInfo.getCommitId(), fakeToke), taskExecutor)
							.join();

						long jobFinishTime = Instant.parse(deployInfo.getJobFinishTime()).toEpochMilli();
						long pipelineCreateTime = Instant.parse(deployInfo.getPipelineCreateTime()).toEpochMilli();

						LeadTime noMergeDelayTime = LeadTime.builder()
							.commitId(deployInfo.getCommitId())
							.pipelineCreateTime((double) pipelineCreateTime)
							.jobFinishTime((double) jobFinishTime)
							.prCreatedTime((double) jobFinishTime)
							.prMergedTime((double) jobFinishTime)
							.build();

						if (pullRequestInfos.isEmpty()) {
							return noMergeDelayTime;
						}

						Optional<PullRequestInfo> mergedPull = pullRequestInfos.stream()
							.filter(gitHubPull -> gitHubPull.getMergedAt() != null)
							.findFirst();

						if (mergedPull.isEmpty()) {
							return noMergeDelayTime;
						}

						List<CommitInfo> commitInfos = CompletableFuture
							.supplyAsync(() -> gitHubFeignClient.getPullRequestCommitInfo(item.getRepository(),
									deployInfo.getCommitId(), fakeToke), taskExecutor)
							.join();

						CommitInfo firstCommitInfo = commitInfos.get(0);
						return LeadTime.mapFrom(mergedPull.get(), deployInfo, firstCommitInfo);
					}
					catch (Exception e) {
						throw new RuntimeException(e);
					}
				}).toList();
				return PipelineLeadTime.builder()
					.pipelineName(item.getPipelineName())
					.pipelineStep(item.getPipelineStep())
					.leadTimes(leadTimes);
			});
			return pipelineLeadTimes;
		});
	}

}
