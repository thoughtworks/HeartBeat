package heartbeat.service.source.github;

import heartbeat.client.GitHubFeignClient;
import heartbeat.client.dto.codebase.github.CommitInfo;
import heartbeat.client.dto.codebase.github.LeadTime;
import heartbeat.client.dto.codebase.github.PipelineLeadTime;
import heartbeat.client.dto.codebase.github.PullRequestInfo;
import heartbeat.client.dto.pipeline.buildkite.DeployInfo;
import heartbeat.client.dto.pipeline.buildkite.DeployTimes;
import heartbeat.exception.BaseException;
import heartbeat.exception.InternalServerErrorException;
import heartbeat.exception.NotFoundException;
import heartbeat.exception.PermissionDenyException;
import heartbeat.service.source.github.model.PipelineInfoOfRepository;
import heartbeat.util.GithubUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Objects;
import java.util.Collections;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Log4j2
public class GitHubService {

	public static final String TOKEN_TITLE = "token ";

	public static final String BEARER_TITLE = "Bearer ";

	private final GitHubFeignClient gitHubFeignClient;

	public void verifyToken(String githubToken) {
		try {
			String token = TOKEN_TITLE + githubToken;
			log.info("Start to request github with token");
			gitHubFeignClient.verifyToken(token);
			log.info("Successfully verify token from github");
		}
		catch (RuntimeException e) {
			Throwable cause = Optional.ofNullable(e.getCause()).orElse(e);
			log.error("Failed to call GitHub with token_error: {} ", cause.getMessage());
			if (cause instanceof BaseException baseException) {
				throw baseException;
			}
			throw new InternalServerErrorException(
					String.format("Failed to call GitHub with token_error: %s", cause.getMessage()));
		}
	}

	public void verifyCanReadTargetBranch(String repository, String branch, String githubToken) {
		try {
			String token = TOKEN_TITLE + githubToken;
			log.info("Start to request github branch: {}", branch);
			gitHubFeignClient.verifyCanReadTargetBranch(GithubUtil.getGithubUrlFullName(repository), branch, token);
			log.info("Successfully verify target branch for github, branch: {}", branch);
		}
		catch (NotFoundException e) {
			log.error("Failed to call GitHub with branch: {}, error: {} ", branch, e.getMessage());
			throw new PermissionDenyException(String.format("Unable to read target branch: %s", branch));
		}
		catch (RuntimeException e) {
			Throwable cause = Optional.ofNullable(e.getCause()).orElse(e);
			log.error("Failed to call GitHub branch:{} with error: {} ", branch, cause.getMessage());
			if (cause instanceof BaseException baseException) {
				throw baseException;
			}
			throw new InternalServerErrorException(
					String.format("Failed to call GitHub branch: %s with error: %s", branch, cause.getMessage()));
		}
	}

	public List<PipelineLeadTime> fetchPipelinesLeadTime(List<DeployTimes> deployTimes,
			Map<String, String> repositories, String token) {
		try {
			String realToken = BEARER_TITLE + token;
			List<PipelineInfoOfRepository> pipelineInfoOfRepositories = getInfoOfRepositories(deployTimes,
					repositories);

			List<CompletableFuture<PipelineLeadTime>> pipelineLeadTimeFutures = pipelineInfoOfRepositories.stream()
				.map(item -> {
					if (item.getPassedDeploy() == null || item.getPassedDeploy().isEmpty()) {
						return CompletableFuture.completedFuture(PipelineLeadTime.builder().build());
					}

					List<CompletableFuture<LeadTime>> leadTimeFutures = getLeadTimeFutures(realToken, item);

					CompletableFuture<List<LeadTime>> allLeadTimesFuture = CompletableFuture
						.allOf(leadTimeFutures.toArray(new CompletableFuture[0]))
						.thenApply(v -> leadTimeFutures.stream()
							.map(CompletableFuture::join)
							.filter(Objects::nonNull)
							.toList());

					return allLeadTimesFuture.thenApply(leadTimes -> PipelineLeadTime.builder()
						.pipelineName(item.getPipelineName())
						.pipelineStep(item.getPipelineStep())
						.leadTimes(leadTimes)
						.build());
				})
				.toList();

			return pipelineLeadTimeFutures.stream().map(CompletableFuture::join).toList();
		}
		catch (RuntimeException e) {
			Throwable cause = Optional.ofNullable(e.getCause()).orElse(e);
			log.error("Failed to get pipeline leadTimes_error: {}", cause.getMessage());
			if (cause instanceof BaseException baseException) {
				throw baseException;
			}
			throw new InternalServerErrorException(
					String.format("Failed to get pipeline leadTimes, cause is: %s", cause.getMessage()));
		}

	}

	private List<CompletableFuture<LeadTime>> getLeadTimeFutures(String realToken, PipelineInfoOfRepository item) {
		return item.getPassedDeploy().stream().map(deployInfo -> {
			CompletableFuture<List<PullRequestInfo>> pullRequestInfoFuture = CompletableFuture.supplyAsync(() -> {
				try {
					return gitHubFeignClient.getPullRequestListInfo(item.getRepository(), deployInfo.getCommitId(),
							realToken);
				}
				catch (NotFoundException e) {
					return Collections.emptyList();
				}
			});
			return pullRequestInfoFuture
				.thenApply(pullRequestInfos -> getLeadTimeByPullRequest(realToken, item, deployInfo, pullRequestInfos));
		}).filter(Objects::nonNull).toList();
	}

	private List<PipelineInfoOfRepository> getInfoOfRepositories(List<DeployTimes> deployTimes,
			Map<String, String> repositories) {
		return deployTimes.stream().map(deployTime -> {
			String repository = GithubUtil.getGithubUrlFullName(repositories.get(deployTime.getPipelineId()));
			List<DeployInfo> validPassedDeploy = deployTime.getPassed() == null ? null
					: deployTime.getPassed()
						.stream()
						.filter(deployInfo -> deployInfo.getJobName().equals(deployTime.getPipelineStep()))
						.toList();
			return PipelineInfoOfRepository.builder()
				.repository(repository)
				.passedDeploy(validPassedDeploy)
				.pipelineStep(deployTime.getPipelineStep())
				.pipelineName(deployTime.getPipelineName())
				.build();
		}).toList();
	}

	private LeadTime getLeadTimeByPullRequest(String realToken, PipelineInfoOfRepository item, DeployInfo deployInfo,
			List<PullRequestInfo> pullRequestInfos) {
		LeadTime noPrLeadTime = parseNoMergeLeadTime(deployInfo, item, realToken);
		if (pullRequestInfos.isEmpty()) {
			return noPrLeadTime;
		}

		Optional<PullRequestInfo> mergedPull = pullRequestInfos.stream()
			.filter(gitHubPull -> gitHubPull.getMergedAt() != null)
			.min(Comparator.comparing(PullRequestInfo::getNumber));

		if (mergedPull.isEmpty()) {
			return noPrLeadTime;
		}

		List<CommitInfo> commitInfos = gitHubFeignClient.getPullRequestCommitInfo(item.getRepository(),
				mergedPull.get().getNumber().toString(), realToken);
		CommitInfo firstCommitInfo = commitInfos.get(0);
		if (!mergedPull.get().getMergeCommitSha().equals(deployInfo.getCommitId())) {
			return noPrLeadTime;
		}
		return mapLeadTimeWithInfo(mergedPull.get(), deployInfo, firstCommitInfo);
	}

	private LeadTime parseNoMergeLeadTime(DeployInfo deployInfo, PipelineInfoOfRepository item, String realToken) {
		long jobFinishTime = Instant.parse(deployInfo.getJobFinishTime()).toEpochMilli();
		long jobStartTime = Instant.parse(deployInfo.getJobStartTime()).toEpochMilli();
		long pipelineCreateTime = Instant.parse(deployInfo.getPipelineCreateTime()).toEpochMilli();
		long prLeadTime = 0;
		long firstCommitTime;
		CommitInfo commitInfo = new CommitInfo();
		try {
			commitInfo = gitHubFeignClient.getCommitInfo(item.getRepository(), deployInfo.getCommitId(), realToken);
		}
		catch (Exception e) {
			log.error("Failed to get commit info_repoId: {},commitId: {}, error: {}", item.getRepository(),
					deployInfo.getCommitId(), e.getMessage());
		}

		if (commitInfo.getCommit() != null && commitInfo.getCommit().getCommitter() != null
				&& commitInfo.getCommit().getCommitter().getDate() != null) {
			firstCommitTime = Instant.parse(commitInfo.getCommit().getCommitter().getDate()).toEpochMilli();
		}
		else {
			firstCommitTime = jobStartTime;
		}

		return LeadTime.builder()
			.commitId(deployInfo.getCommitId())
			.pipelineCreateTime(pipelineCreateTime)
			.jobFinishTime(jobFinishTime)
			.pipelineLeadTime(jobFinishTime - firstCommitTime)
			.totalTime(jobFinishTime - firstCommitTime)
			.prLeadTime(prLeadTime)
			.build();
	}

	public LeadTime mapLeadTimeWithInfo(PullRequestInfo pullRequestInfo, DeployInfo deployInfo, CommitInfo commitInfo) {
		if (pullRequestInfo.getMergedAt() == null) {
			return null;
		}
		long prCreatedTime = Instant.parse(pullRequestInfo.getCreatedAt()).toEpochMilli();
		long prMergedTime = Instant.parse(pullRequestInfo.getMergedAt()).toEpochMilli();
		long jobFinishTime = Instant.parse(deployInfo.getJobFinishTime()).toEpochMilli();
		long pipelineCreateTime = Instant.parse(deployInfo.getPipelineCreateTime()).toEpochMilli();
		long firstCommitTimeInPr;
		if (commitInfo.getCommit() != null && commitInfo.getCommit().getCommitter() != null
				&& commitInfo.getCommit().getCommitter().getDate() != null) {
			firstCommitTimeInPr = Instant.parse(commitInfo.getCommit().getCommitter().getDate()).toEpochMilli();
		}
		else {
			firstCommitTimeInPr = 0;
		}

		long pipelineLeadTime = jobFinishTime - prMergedTime;
		long prLeadTime;
		long totalTime;
		if (commitInfo.getCommit().getMessage().toLowerCase().startsWith("revert")) {
			prLeadTime = 0;
		}
		else {
			if (firstCommitTimeInPr > 0) {
				prLeadTime = prMergedTime - firstCommitTimeInPr;
			}
			else {
				prLeadTime = prMergedTime - prCreatedTime;
			}
		}
		totalTime = prLeadTime + pipelineLeadTime;

		return LeadTime.builder()
			.pipelineLeadTime(pipelineLeadTime)
			.prLeadTime(prLeadTime)
			.firstCommitTimeInPr(firstCommitTimeInPr)
			.prMergedTime(prMergedTime)
			.totalTime(totalTime)
			.prCreatedTime(prCreatedTime)
			.commitId(deployInfo.getCommitId())
			.jobFinishTime(jobFinishTime)
			.pipelineCreateTime(pipelineCreateTime)
			.build();
	}

	public CommitInfo fetchCommitInfo(String commitId, String repositoryId, String token) {
		try {
			String realToken = BEARER_TITLE + token;
			log.info("Start to get commit info, repoId: {},commitId: {}", repositoryId, commitId);
			CommitInfo commitInfo = gitHubFeignClient.getCommitInfo(repositoryId, commitId, realToken);
			log.info("Successfully get commit info, repoId: {},commitId: {}, author: {}", repositoryId, commitId,
					commitInfo.getCommit().getAuthor());
			return commitInfo;
		}
		catch (RuntimeException e) {
			Throwable cause = Optional.ofNullable(e.getCause()).orElse(e);
			log.error("Failed to get commit info_repoId: {},commitId: {}, error: {}", repositoryId, commitId,
					cause.getMessage());
			if (cause instanceof NotFoundException) {
				return null;
			}
			if (cause instanceof BaseException baseException) {
				throw baseException;
			}
			throw new InternalServerErrorException(String.format("Failed to get commit info_repoId: %s,cause is: %s",
					repositoryId, cause.getMessage()));
		}
	}

}
