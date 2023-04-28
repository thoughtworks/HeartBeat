package heartbeat.service.source.github;

import feign.FeignException;
import heartbeat.client.GitHubFeignClient;
import heartbeat.client.dto.codebase.github.GitHubOrganizationsInfo;
import heartbeat.client.dto.codebase.github.GitHubRepo;
import heartbeat.client.dto.codebase.github.GitHubRepos;
import heartbeat.client.dto.codebase.github.LeadTime;
import heartbeat.client.dto.codebase.github.PipelineLeadTime;
import heartbeat.client.dto.codebase.github.PullRequestInfo;
import heartbeat.client.dto.pipeline.buildkite.DeployInfo;
import heartbeat.client.dto.pipeline.buildkite.DeployTimes;
import heartbeat.controller.source.dto.GitHubResponse;
import heartbeat.exception.RequestFailedException;
import heartbeat.service.codebase.ICodebase;
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
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class GitHubService implements ICodebase {

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

	public CompletableFuture<List<PipelineLeadTime>> _fetchPipelinesLeadTime(
		List<DeployTimes> deployTimes,
		Map<String, String> repositories
	) {
		return CompletableFuture.supplyAsync(() -> {
			ArrayList<PipelineLeadTime> pipelineLeadTimes = new ArrayList<>();
			deployTimes.stream().map(deployTime -> {
				String repository = GithubUtil.getGithubUrlFullName(repositories.get(deployTime.getPipelineId()));
				return PipelineInfoOfRepository
					.builder()
					.repository(repository)
					.passedDeploy(deployTime.getPassed())
					.pipelineStep(deployTime.getPipelineStep())
					.pipelineName(deployTime.getPipelineName())
					.build();
			}).map(item -> {
				List<DeployInfo> passedDeployInfos = item.getPassedDeploy();
				String fakeToke = "Token";
				List<LeadTime> leadTimes = passedDeployInfos.stream().map(deployInfo -> {
					try {
						List<PullRequestInfo> pullRequestInfos = CompletableFuture
							.supplyAsync(() -> gitHubFeignClient.getPullRequestListInfo(item.getRepository(), deployInfo.getCommitId(), fakeToke), taskExecutor).join();

						long jobFinishTime = Instant.parse(deployInfo.getJobFinishTime()).toEpochMilli();
						long pipelineCreateTime = Instant.parse(deployInfo.getPipelineCreateTime()).toEpochMilli();

						LeadTime noMergeDelayTime = LeadTime.builder()
							.commitId(deployInfo.getCommitId())
							.pipelineCreateTime((double)pipelineCreateTime)
							.jobFinishTime((double) jobFinishTime)
							.prCreatedTime((double) jobFinishTime)
							.prMergedTime((double) jobFinishTime)
							.build();

						if (pullRequestInfos.isEmpty()) {
							return noMergeDelayTime;
						}

						Optional<GitHubPull> mergedPull = gitHubPulls.stream()
							.filter(gitHubPull -> gitHubPull.getMergedAt() != null)
							.findFirst();

						if (mergedPull.isEmpty()) {
							return noMergeDelayTime;
						}

						logger.info("[Github] Start to query the pull request commits_url:" +
							this.httpClient.defaults.baseURL() +
							"/repos/" + repository + "/pulls/" + mergedPull.get().getNumber() + "/commits");

						response = this.httpClient.newCall(new Request.Builder()
							.url(this.httpClient.defaults.baseURL() +
								"/repos/" + repository + "/pulls/" + mergedPull.get().getNumber() + "/commits")
							.build()).execute();

						maskEmailResponseLogger("[Github] Successfully queried the pull request commits_data", response);

						List<CommitInfo> gitHubCommits = new JsonConvert().deserializeArray(response.body().string(), CommitInfo.class);

						CommitInfo firstCommit = gitHubCommits.get(0);

						return LeadTime.mapFrom(mergedPull.get(), deployInfo, firstCommit);

					} catch (IOException e) {
						logger.error("[Github] Error while querying pipeline lead time", e);
						return null;
					}
				}).collect(Collectors.toList());
			});
			return pipelineLeadTimes;
		});
	}


	public CompletableFuture<Set<PipelineLeadTime[]>> fetchPipelinesLeadTime(
		List<DeployTimes> deployTimes,
		Map<String, String> repositories
	) {
		List<CompletableFuture<List<PipelineLeadTime[]>>> deployTimeFutures = deployTimes.stream()
			.map(deploy ->{
				String repositoryAddress = repositories.get(deploy.getPipelineId());
				String repositoryName = repositoryAddress.replaceFirst("^(.*?github.com/)", "").replaceFirst("(\\.git)?$", "");
				Map<String, Object> deployInfoList = new HashMap<>();
				deployInfoList.put("repositoryName", repositoryName);
				deployInfoList.put("deployInfo", deploy.getPassed());
				deployInfoList.put("pipelineName", deploy.getPipelineName());
				deployInfoList.put("pipelineStep", deploy.getPipelineStep());
				return deployInfoList;
			}).toList().stream().map(item -> {
					String repositoryName = (String) item.get("repositoryName");

				CompletableFuture<List<LeadTime>> leadTimeFutures = item.get("deployInfo").map(()->{})
					List<String> repos = gitHubFeignClient

				})
				}));

	List<Map<String, Object>> deployInfoList = deployTimes.stream().map(deploy -> {
		String repositoryAddress = repositories.get(deploy.pipelineId);
		String repository = repositoryAddress.replaceFirst("^(.*?github.com/)", "").replaceFirst("(\\.git)?$", "");
		Map<String, Object> deployInfo = new HashMap<>();
		deployInfo.put("repository", repository);
		deployInfo.put("deployInfo", deploy.passed);
		deployInfo.put("pipelineName", deploy.pipelineName);
		deployInfo.put("pipelineStep", deploy.pipelineStep);
		return deployInfo;
	}).collect(Collectors.toList());

	List<CompletableFuture<List<LeadTime>>> LeadTimesFutures = deployInfoList.stream().map(item -> {
		String repository = (String) item.get("repository");
		List<Map<String, String>> deployInfoList = (List<Map<String, String>>) item.get("deployInfo");
		CompletableFuture<List<LeadTime>> leadTimeFuture = CompletableFuture.supplyAsync(() -> {
			List<LeadTime> leadTimes = new ArrayList<>();
			for (Map<String, String> deployInfo : deployInfoList) {
				String commitId = deployInfo.get("commitId");
				logger.info("[Github] Start to query pipeline leadTime_url:" + this.httpClient.defaults.baseURL + "/repos/" + repository + "/commits/" + commitId + "/pulls");
				try {
					Response response = this.httpClient.get("/repos/" + repository + "/commits/" + commitId + "/pulls");
					maskEmailResponseLogger("[Github] Successfully queried pipeline leadTime_data", response);
					List<PullRequest> pullRequests = response.body().jsonPath().getList(".", PullRequest.class);
					for (PullRequest pullRequest : pullRequests) {
						LeadTime leadTime = new LeadTime();
						leadTime.pipelineName = (String) item.get("pipelineName");
						leadTime.pipelineStep = (String) item.get("pipelineStep");
						leadTime.pullRequestId = pullRequest.number;
						leadTime.branch = pullRequest.head.ref;
						leadTime.commitId = commitId;
						leadTime.timeCreated = pullRequest.createdAt;
						leadTime.timeMerged = pullRequest.mergedAt;
						leadTimes.add(leadTime);
					}
				} catch (Exception e) {
					logger.warn("[Github] Failed to query pipeline leadTime_url:" + this.httpClient.defaults.baseURL + "/repos/" + repository + "/commits/" + commitId + "/pulls", e);
				}
			}
			return leadTimes;
		});
		return leadTimeFuture;
	}).collect(Collectors.toList());

	List<List<LeadTime>> allLeadTimes = LeadTimesFutures.stream()
		.map(CompletableFuture::join)
		.collect(Collectors.toList());
	List<LeadTime> leadTimes = allLeadTimes.stream().flatMap(List::stream).collect(Collectors.toList());



//		List<CompletableFuture<List<LeadTime>>> LeadTimesFutures = deployInfoList.stream().map(item -> {
//			String repository = (String) item.get("repository");
//			List<Map<String, String>> deployInfoList = (List<Map<String, String>>) item.get("deployInfo");
//			CompletableFuture<List<LeadTime>> leadTimeFuture = CompletableFuture.supplyAsync(() -> {
//				List<LeadTime> leadTimes = new ArrayList<>();
//				for (Map<String, String> deployInfo : deployInfoList) {
//					String commitId = deployInfo.get("commitId");
//					logger.info("[Github] Start to query pipeline leadTime_url:" + this.httpClient.defaults.baseURL + "/repos/" + repository + "/commits/" + commitId + "/pulls");
//					try {
//						Response response = this.httpClient.get("/repos/" + repository + "/commits/" + commitId + "/pulls");
//						maskEmailResponseLogger("[Github] Successfully queried pipeline leadTime_data", response);
//						List<PullRequest> pullRequests = response.body().jsonPath().getList(".", PullRequest.class);
//						for (PullRequest pullRequest : pullRequests) {
//							LeadTime leadTime = new LeadTime();
//							leadTime.pipelineName = (String) item.get("pipelineName");
//							leadTime.pipelineStep = (String) item.get("pipelineStep");
//							leadTime.pullRequestId = pullRequest.number;
//							leadTime.branch = pullRequest.head.ref;
//							leadTime.commitId = commitId;
//							leadTime.timeCreated = pullRequest.createdAt;
//							leadTime.timeMerged = pullRequest.mergedAt;
//							leadTimes.add(leadTime);
//						}
//					} catch (Exception e) {
//						logger.warn("[Github] Failed to query pipeline leadTime_url:" + this.httpClient.defaults.baseURL + "/repos/" + repository + "/commits/" + commitId + "/pulls", e);
//					}
//				}
//				return leadTimes;
//			});
//			return leadTimeFuture;
//		}).collect(Collectors.toList());

//		List<List<LeadTime>> allLeadTimes = LeadTimesFutures.stream()
//			.map(CompletableFuture::join)
//			.collect(Collectors.toList());
//		List<LeadTime> leadTimes = allLeadTimes.stream().flatMap(List::stream).collect(Collectors.toList());
//				CompletableFuture<List<LeadTime>> leadTimesFuture = CompletableFuture.allOf(item.deployInfo.stream()
//						.map(deployInfo -> CompletableFuture.supplyAsync(() -> {
//							String leadTimeUrl = String.format("%s/repos/%s/commits/%s/pulls",
//								this.httpClient.defaults.baseURL(), item.repository, deployInfo.commitId());
//							log.info("[Github] Start to query pipeline {}", leadTimeUrl);
//							return queryLeadTimeFromGithub(leadTimeUrl, token, deployInfo.createdAt(), deployInfo.mergedAt());
//						}, taskExecutor))
//						.toArray(CompletableFuture[]::new))
//					.thenApply(v -> item.deployInfo.stream()
//						.map(deployInfo -> {
//							try {
//								return leadTimesQueue.poll(1, TimeUnit.SECONDS);
//							} catch (InterruptedException e) {
//								log.error("[Github] Interrupted when getting leadTime from queue", e);
//								return null;
//							}
//						})
//						.collect(Collectors.toList()));


//		return CompletableFuture.allOf(
//		List<CompletableFuture<List<PipelineLeadTime[]>>> LeadTimesFuture = gitHubOrganizations.stream()

//			deployTimes.stream().map(deploy -> {
////				repositories.get(g)
//				String repositoryAddress = repositories.get(deploy.getPipelineId());
//				String repository = GitUrlParse.parse(repositoryAddress).fullName();
//				return CompletableFuture.supplyAsync(() -> {
//					List<LeadTime> leadTimes = deploy.getPassed().stream()
//						.map(deployInfo -> {
//							logger.info(String.format("[Github] Start to query pipeline leadTime_url: %s/repos/%s/commits/%s/pulls",
//								httpClient.defaults().baseURL(), repository, deployInfo.getCommitId()));
//							Response response = httpClient.get(String.format("/repos/%s/commits/%s/pulls", repository, deployInfo.getCommitId()));
//							maskEmailResponseLogger("[Github] Successfully queried pipeline leadTime_data", response);
//
//							List<GitHubPull> gitHubPulls = new JsonConvert().deserializeList(response.body().string(), GitHubPull.class);
//
//							long jobFinishTime = new Date(deployInfo.getJobFinishTime()).getTime();
//							long pipelineCreateTime = new Date(deployInfo.getPipelineCreateTime()).getTime();
//
//							LeadTime noMergeDelayTime = new LeadTime(deployInfo.getCommitId(), pipelineCreateTime, jobFinishTime, pipelineCreateTime, pipelineCreateTime);
//
//							if (gitHubPulls.size() == 0) {
//								return noMergeDelayTime;
//							}
//
//							GitHubPull mergedPull = gitHubPulls.stream()
//								.filter(gitHubPull -> gitHubPull.getMergedAt() != null)
//								.findFirst().orElse(null);
//
//							if (mergedPull == null) {
//								return noMergeDelayTime;
//							}
//
//							logger.info(String.format("[Github] Start to query the pull request commits_url: %s/repos/%s/pulls/%s/commits",
//								httpClient.defaults().baseURL(), repository, mergedPull.getNumber()));
//							Response prResponse = httpClient.get(String.format("/repos/%s/pulls/%s/commits", repository, mergedPull.getNumber()));
//							maskEmailResponseLogger("[Github] Successfully queried the pull request commits_data", prResponse);
//
//							List<CommitInfo> gitHubCommites = new JsonConvert().deserializeList(prResponse.body().string(), CommitInfo.class);
//
//							CommitInfo firstCommit = gitHubCommites.get(0);
//
//							return LeadTime.mapFrom(mergedPull, deployInfo, firstCommit);
//						})
//						.collect(Collectors.toList());
//
//					return new PipelineLeadTime(deploy.getPipelineName(), deploy.getPipelineStep(), leadTimes);
//				});
//			}).toArray(CompletableFuture[]::new)
//		).thenApply(v -> Arrays.stream(v)
//			.map(CompletableFuture::join)
//			.collect(Collectors.toList())
//		);
//	}


//	public List<PipelineLeadTime> fetchPipelinesLeadTime(List<DeployTimes> deployTimes, Map<String, String> repositories) {

		//		LeadTime noMergeDelayTime = new LeadTime(
//			deployInfo.getCommitId(),
//			pipelineCreateTime,
//			jobFinishTime,
//			pipelineCreateTime,
//			pipelineCreateTime
//		);
//
//		if (gitHubPulls.length == 0) {
//			return noMergeDelayTime;
//		}
//
//		GitHubPull mergedPull = null;
//		for (int i = gitHubPulls.length - 1; i >= 0; i--) {
//			GitHubPull gitHubPull = gitHubPulls[i];
//			if (gitHubPull.getMergedAt() != null) {
//				mergedPull = gitHubPull;
//				break;
//			}
//		}
//
//		if (mergedPull == null) {
//			return noMergeDelayTime;
//		}
//
//		return LeadTime.mapFrom(mergedPull, deployInfo, firstCommit);
//		return null;
//	};
}
