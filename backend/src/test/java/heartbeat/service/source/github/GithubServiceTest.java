package heartbeat.service.source.github;

import heartbeat.client.GitHubFeignClient;
import heartbeat.client.dto.codebase.github.Author;
import heartbeat.client.dto.codebase.github.Commit;
import heartbeat.client.dto.codebase.github.CommitInfo;
import heartbeat.client.dto.codebase.github.Committer;
import heartbeat.client.dto.codebase.github.LeadTime;
import heartbeat.client.dto.codebase.github.PipelineLeadTime;
import heartbeat.client.dto.codebase.github.PullRequestInfo;
import heartbeat.client.dto.pipeline.buildkite.DeployInfo;
import heartbeat.client.dto.pipeline.buildkite.DeployTimes;
import heartbeat.exception.BadRequestException;
import heartbeat.exception.InternalServerErrorException;
import heartbeat.exception.NotFoundException;
import heartbeat.exception.PermissionDenyException;
import heartbeat.exception.UnauthorizedException;
import heartbeat.service.source.github.model.PipelineInfoOfRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletionException;

import static heartbeat.TestFixtures.GITHUB_REPOSITORY;
import static heartbeat.TestFixtures.GITHUB_TOKEN;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class GithubServiceTest {

	public static final String PIPELINE_STEP = "FakeName";

	private static final String JOB_NAME = PIPELINE_STEP;

	@Mock
	GitHubFeignClient gitHubFeignClient;

	@InjectMocks
	GitHubService githubService;

	@Mock
	PullRequestInfo pullRequestInfo;

	@Mock
	PipelineInfoOfRepository pipelineInfoOfRepository;

	@Mock
	DeployInfo deployInfo;

	@Mock
	CommitInfo commitInfo;

	@Mock
	List<DeployTimes> deployTimes;

	@Mock
	List<PipelineLeadTime> pipelineLeadTimes;

	@Mock
	Map<String, String> repositoryMap;

	@BeforeEach
	public void setUp() {
		githubService = new GitHubService(gitHubFeignClient);
		pullRequestInfo = PullRequestInfo.builder()
			.mergedAt("2022-07-23T04:04:00.000+00:00")
			.createdAt("2022-07-23T04:03:00.000+00:00")
			.mergeCommitSha("111")
			.url("https://api.github.com/repos/XXXX-fs/fs-platform-onboarding/pulls/1")
			.number(1)
			.build();
		deployInfo = DeployInfo.builder()
			.commitId("111")
			.pipelineCreateTime("2022-07-23T04:05:00.000+00:00")
			.jobStartTime("2022-07-23T04:04:00.000+00:00")
			.jobFinishTime("2022-07-23T04:06:00.000+00:00")
			.state("passed")
			.build();
		commitInfo = CommitInfo.builder()
			.commit(Commit.builder()
				.committer(Committer.builder().date("2022-07-23T04:03:00.000+00:00").build())
				.message("mock commit message")
				.build())
			.build();

		deployTimes = List.of(DeployTimes.builder()
			.pipelineId("fs-platform-onboarding")
			.pipelineName("Name")
			.pipelineStep(PIPELINE_STEP)
			.passed(List.of(DeployInfo.builder()
				.jobName(JOB_NAME)
				.pipelineCreateTime("2022-07-23T04:05:00.000+00:00")
				.jobStartTime("2022-07-23T04:04:00.000+00:00")
				.jobFinishTime("2022-07-23T04:06:00.000+00:00")
				.commitId("111")
				.state("passed")
				.jobName(JOB_NAME)
				.build()))
			.build());

		pipelineLeadTimes = List.of(PipelineLeadTime.builder()
			.pipelineName("Name")
			.pipelineStep(PIPELINE_STEP)
			.leadTimes(List.of(LeadTime.builder()
				.commitId("111")
				.prCreatedTime(1658548980000L)
				.prMergedTime(1658549040000L)
				.firstCommitTimeInPr(1658548980000L)
				.jobStartTime(1658549040000L)
				.jobFinishTime(1658549160000L)
				.pipelineLeadTime(1658549100000L)
				.pipelineCreateTime(1658549100000L)
				.prLeadTime(60000L)
				.pipelineLeadTime(120000)
				.firstCommitTime(1658549040000L)
				.totalTime(180000)
				.isRevert(Boolean.FALSE)
				.build()))
			.build());

		repositoryMap = new HashMap<>();
		repositoryMap.put("fs-platform-payment-selector", "https://github.com/XXXX-fs/fs-platform-onboarding");
		repositoryMap.put("fs-platform-onboarding", "https://github.com/XXXX-fs/fs-platform-onboarding");

		pipelineInfoOfRepository = PipelineInfoOfRepository.builder()
			.repository("https://github.com/XXXX-fs/fs-platform-onboarding")
			.passedDeploy(deployTimes.get(0).getPassed())
			.pipelineStep(deployTimes.get(0).getPipelineStep())
			.pipelineName(deployTimes.get(0).getPipelineName())
			.build();
	}

	@Test
	void shouldReturnGithubTokenIsVerifyWhenVerifyToken() {
		String githubToken = GITHUB_TOKEN;
		String token = "token " + githubToken;

		doNothing().when(gitHubFeignClient).verifyToken(token);

		assertDoesNotThrow(() -> githubService.verifyToken(githubToken));
	}

	@Test
	void shouldReturnGithubBranchIsVerifyWhenVerifyBranch() {
		String githubToken = GITHUB_TOKEN;
		String token = "token " + githubToken;
		doNothing().when(gitHubFeignClient).verifyCanReadTargetBranch(any(), any(), any());

		githubService.verifyCanReadTargetBranch(GITHUB_REPOSITORY, "main", githubToken);

		verify(gitHubFeignClient, times(1)).verifyCanReadTargetBranch("fake/repo", "main", token);
	}

	@Test
	void shouldThrowUnauthorizedExceptionGivenGithubReturnUnauthorizedExceptionWhenVerifyToken() {
		String githubEmptyToken = GITHUB_TOKEN;
		doThrow(new UnauthorizedException("Failed to get GitHub info_status: 401 UNAUTHORIZED, reason: ..."))
			.when(gitHubFeignClient)
			.verifyToken("token " + githubEmptyToken);

		var exception = assertThrows(UnauthorizedException.class, () -> githubService.verifyToken(githubEmptyToken));
		assertEquals("Failed to get GitHub info_status: 401 UNAUTHORIZED, reason: ...", exception.getMessage());
	}

	@Test
	void shouldThrowBadRequestExceptionGivenGithubReturnUnExpectedExceptionWhenVerifyBranch() {
		String githubEmptyToken = GITHUB_TOKEN;
		doThrow(new UnauthorizedException("Failed to get GitHub info_status: 401 UNAUTHORIZED, reason: ..."))
			.when(gitHubFeignClient)
			.verifyCanReadTargetBranch("fake/repo", "main", "token " + githubEmptyToken);

		var exception = assertThrows(BadRequestException.class,
				() -> githubService.verifyCanReadTargetBranch(GITHUB_REPOSITORY, "main", githubEmptyToken));
		assertEquals("Unable to read target branch: main, with token error", exception.getMessage());
	}

	@Test
	void shouldThrowNotFoundExceptionGivenGithubReturnNotFoundExceptionWhenVerifyBranch() {
		String githubEmptyToken = GITHUB_TOKEN;
		doThrow(new NotFoundException("Failed to get GitHub info_status: 404, reason: ...")).when(gitHubFeignClient)
			.verifyCanReadTargetBranch("fake/repo", "main", "token " + githubEmptyToken);

		var exception = assertThrows(NotFoundException.class,
				() -> githubService.verifyCanReadTargetBranch(GITHUB_REPOSITORY, "main", githubEmptyToken));
		assertEquals("Unable to read target branch: main", exception.getMessage());
	}

	@Test
	void shouldThrowInternalServerErrorExceptionGivenGithubReturnInternalServerErrorExceptionWhenVerifyBranch() {
		String githubEmptyToken = GITHUB_TOKEN;
		doThrow(new InternalServerErrorException("Failed to get GitHub info_status: 500, reason: ..."))
			.when(gitHubFeignClient)
			.verifyCanReadTargetBranch("fake/repo", "main", "token " + githubEmptyToken);

		var exception = assertThrows(InternalServerErrorException.class,
				() -> githubService.verifyCanReadTargetBranch(GITHUB_REPOSITORY, "main", githubEmptyToken));
		assertEquals("Failed to get GitHub info_status: 500, reason: ...", exception.getMessage());
	}

	@Test
	void shouldThrowInternalServerErrorExceptionGivenGithubReturnCompletionExceptionWhenVerifyToken() {
		String githubEmptyToken = GITHUB_TOKEN;
		doThrow(new CompletionException(new Exception("UnExpected Exception"))).when(gitHubFeignClient)
			.verifyToken("token " + githubEmptyToken);

		var exception = assertThrows(InternalServerErrorException.class,
				() -> githubService.verifyToken(githubEmptyToken));
		assertEquals("Failed to call GitHub with token_error: UnExpected Exception", exception.getMessage());
	}

	@Test
	void shouldThrowInternalServerErrorExceptionGivenGithubReturnCompletionExceptionWhenVerifyBranch() {
		String githubEmptyToken = GITHUB_TOKEN;
		doThrow(new CompletionException(new Exception("UnExpected Exception"))).when(gitHubFeignClient)
			.verifyCanReadTargetBranch("fake/repo", "main", "token " + githubEmptyToken);

		var exception = assertThrows(InternalServerErrorException.class,
				() -> githubService.verifyCanReadTargetBranch(GITHUB_REPOSITORY, "main", githubEmptyToken));
		assertEquals("Failed to call GitHub branch: main with error: UnExpected Exception", exception.getMessage());
	}

	@Test
	void shouldThrowUnauthorizedExceptionGivenGithubReturnPermissionDenyExceptionWhenVerifyBranch() {
		String githubEmptyToken = GITHUB_TOKEN;
		doThrow(new PermissionDenyException("Failed to get GitHub info_status: 403 FORBIDDEN..."))
			.when(gitHubFeignClient)
			.verifyCanReadTargetBranch("fake/repo", "main", "token " + githubEmptyToken);

		var exception = assertThrows(UnauthorizedException.class,
				() -> githubService.verifyCanReadTargetBranch(GITHUB_REPOSITORY, "main", githubEmptyToken));
		assertEquals("Unable to read target organization", exception.getMessage());
	}

	@Test
	void shouldReturnNullWhenMergeTimeIsNull() {
		PullRequestInfo pullRequestInfo = PullRequestInfo.builder().build();
		DeployInfo deployInfo = DeployInfo.builder().build();
		CommitInfo commitInfo = CommitInfo.builder().build();

		LeadTime result = githubService.mapLeadTimeWithInfo(pullRequestInfo, deployInfo, commitInfo);

		assertNull(result);
	}

	@Test
	void shouldReturnLeadTimeWhenMergedTimeIsNotNull() {
		LeadTime expect = LeadTime.builder()
			.commitId("111")
			.prCreatedTime(1658548980000L)
			.prMergedTime(1658549040000L)
			.firstCommitTimeInPr(1658548980000L)
			.jobStartTime(1658549040000L)
			.jobFinishTime(1658549160000L)
			.pipelineLeadTime(1658549100000L)
			.pipelineCreateTime(1658549100000L)
			.prLeadTime(60000L)
			.pipelineLeadTime(120000)
			.firstCommitTime(1658549040000L)
			.totalTime(180000)
			.isRevert(Boolean.FALSE)
			.build();

		LeadTime result = githubService.mapLeadTimeWithInfo(pullRequestInfo, deployInfo, commitInfo);

		assertEquals(expect, result);
	}

	@Test
	void CommitTimeInPrShouldBeZeroWhenCommitInfoIsNull() {
		commitInfo = CommitInfo.builder().commit(Commit.builder().message("mock commit message").build()).build();
		LeadTime expect = LeadTime.builder()
			.commitId("111")
			.prCreatedTime(1658548980000L)
			.prMergedTime(1658549040000L)
			.firstCommitTimeInPr(0L)
			.jobStartTime(1658549040000L)
			.jobFinishTime(1658549160000L)
			.pipelineLeadTime(1658549100000L)
			.pipelineCreateTime(1658549100000L)
			.prLeadTime(0L)
			.pipelineLeadTime(120000)
			.firstCommitTime(1658549040000L)
			.totalTime(120000)
			.isRevert(Boolean.FALSE)
			.build();

		LeadTime result = githubService.mapLeadTimeWithInfo(pullRequestInfo, deployInfo, commitInfo);

		assertEquals(expect, result);
	}

	@Test
	void CommitTimeInPrLeadTimeShouldBeZeroWhenCommitInfoIsNotNullGivenCommitIsReverted() {
		commitInfo = CommitInfo.builder().commit(Commit.builder().message("Revert commit message").build()).build();
		LeadTime expect = LeadTime.builder()
			.commitId("111")
			.prCreatedTime(1658548980000L)
			.prMergedTime(1658549040000L)
			.firstCommitTimeInPr(0L)
			.jobStartTime(1658549040000L)
			.jobFinishTime(1658549160000L)
			.pipelineLeadTime(1658549100000L)
			.pipelineCreateTime(1658549100000L)
			.prLeadTime(0L)
			.pipelineLeadTime(120000)
			.firstCommitTime(1658549040000L)
			.totalTime(120000)
			.isRevert(Boolean.TRUE)
			.build();

		LeadTime result = githubService.mapLeadTimeWithInfo(pullRequestInfo, deployInfo, commitInfo);

		assertEquals(expect, result);
	}

	@Test
	void CommitTimeInPrLeadTimeShouldBeZeroWhenCommitInfoIsInLowerCaseGivenCommitIsReverted() {
		commitInfo = CommitInfo.builder().commit(Commit.builder().message("revert commit message").build()).build();
		LeadTime expect = LeadTime.builder()
			.commitId("111")
			.prCreatedTime(1658548980000L)
			.prMergedTime(1658549040000L)
			.firstCommitTimeInPr(0L)
			.jobStartTime(1658549040000L)
			.jobFinishTime(1658549160000L)
			.pipelineLeadTime(1658549100000L)
			.pipelineCreateTime(1658549100000L)
			.prLeadTime(0L)
			.pipelineLeadTime(120000)
			.firstCommitTime(1658549040000L)
			.isRevert(Boolean.TRUE)
			.totalTime(120000)
			.build();

		LeadTime result = githubService.mapLeadTimeWithInfo(pullRequestInfo, deployInfo, commitInfo);

		assertEquals(expect, result);
	}

	@Test
	void shouldReturnIsRevertIsNullWhenCommitInfoCommitIsNull() {
		commitInfo = CommitInfo.builder().build();
		LeadTime expect = LeadTime.builder()
			.commitId("111")
			.prCreatedTime(1658548980000L)
			.prMergedTime(1658549040000L)
			.firstCommitTimeInPr(0L)
			.jobStartTime(1658549040000L)
			.jobFinishTime(1658549160000L)
			.pipelineLeadTime(1658549100000L)
			.pipelineCreateTime(1658549100000L)
			.prLeadTime(0L)
			.pipelineLeadTime(120000)
			.firstCommitTime(1658549040000L)
			.totalTime(120000L)
			.isRevert(null)
			.build();

		LeadTime result = githubService.mapLeadTimeWithInfo(pullRequestInfo, deployInfo, commitInfo);

		assertEquals(expect, result);
	}

	@Test
	void shouldReturnIsRevertIsNullWhenCommitInfoCommitMessageIsNull() {
		commitInfo = CommitInfo.builder().commit(Commit.builder().build()).build();
		LeadTime expect = LeadTime.builder()
			.commitId("111")
			.prCreatedTime(1658548980000L)
			.prMergedTime(1658549040000L)
			.firstCommitTimeInPr(0L)
			.jobStartTime(1658549040000L)
			.jobFinishTime(1658549160000L)
			.pipelineLeadTime(1658549100000L)
			.pipelineCreateTime(1658549100000L)
			.prLeadTime(0L)
			.pipelineLeadTime(120000)
			.firstCommitTime(1658549040000L)
			.totalTime(120000L)
			.isRevert(null)
			.build();

		LeadTime result = githubService.mapLeadTimeWithInfo(pullRequestInfo, deployInfo, commitInfo);

		assertEquals(expect, result);
	}

	@Test
	void shouldReturnFirstCommitTimeInPrZeroWhenCommitInfoIsNull() {
		commitInfo = CommitInfo.builder().commit(Commit.builder().message("mock commit message").build()).build();
		LeadTime expect = LeadTime.builder()
			.commitId("111")
			.prCreatedTime(1658548980000L)
			.prMergedTime(1658549040000L)
			.firstCommitTimeInPr(0L)
			.jobStartTime(1658549040000L)
			.jobFinishTime(1658549160000L)
			.pipelineLeadTime(1658549100000L)
			.pipelineCreateTime(1658549100000L)
			.prLeadTime(0L)
			.pipelineLeadTime(120000)
			.firstCommitTime(1658549040000L)
			.totalTime(120000L)
			.isRevert(Boolean.FALSE)
			.build();

		LeadTime result = githubService.mapLeadTimeWithInfo(pullRequestInfo, deployInfo, commitInfo);

		assertEquals(expect, result);
	}

	@Test
	void shouldReturnPipeLineLeadTimeWhenDeployITimesIsNotEmpty() {
		String mockToken = "mockToken";
		when(gitHubFeignClient.getPullRequestListInfo(any(), any(), any())).thenReturn(List.of(pullRequestInfo));
		when(gitHubFeignClient.getPullRequestCommitInfo(any(), any(), any())).thenReturn(List.of(commitInfo));
		when(gitHubFeignClient.getCommitInfo(any(), any(), any())).thenReturn(commitInfo);

		List<PipelineLeadTime> result = githubService.fetchPipelinesLeadTime(deployTimes, repositoryMap, mockToken);

		assertEquals(pipelineLeadTimes, result);
	}

	@Test
	void shouldReturnEmptyLeadTimeWhenDeployTimesIsEmpty() {
		String mockToken = "mockToken";
		List<PipelineLeadTime> expect = List.of(PipelineLeadTime.builder().build());
		when(gitHubFeignClient.getPullRequestListInfo(any(), any(), any())).thenReturn(List.of(pullRequestInfo));
		when(gitHubFeignClient.getPullRequestCommitInfo(any(), any(), any())).thenReturn(List.of(commitInfo));
		List<DeployTimes> emptyDeployTimes = List.of(DeployTimes.builder().build());

		List<PipelineLeadTime> result = githubService.fetchPipelinesLeadTime(emptyDeployTimes, repositoryMap,
				mockToken);

		assertEquals(expect, result);
	}

	@Test
	void shouldReturnEmptyLeadTimeGithubShaIsDifferent() {
		String mockToken = "mockToken";
		List<PipelineLeadTime> expect = List.of(PipelineLeadTime.builder()
			.pipelineStep(PIPELINE_STEP)
			.pipelineName("Name")
			.leadTimes(List.of(LeadTime.builder()
				.commitId("111")
				.noPRCommitTime(1658548980000L)
				.jobStartTime(1658549040000L)
				.jobFinishTime(1658549160000L)
				.pipelineCreateTime(1658549100000L)
				.prLeadTime(0L)
				.pipelineLeadTime(180000)
				.firstCommitTime(1658548980000L)
				.totalTime(180000)
				.isRevert(Boolean.FALSE)
				.build()))
			.build());
		var pullRequestInfoWithDifferentSha = PullRequestInfo.builder()
			.mergedAt("2022-07-23T04:04:00.000+00:00")
			.createdAt("2022-07-23T04:03:00.000+00:00")
			.mergeCommitSha("222")
			.url("https://api.github.com/repos/XXXX-fs/fs-platform-onboarding/pulls/1")
			.number(1)
			.build();
		when(gitHubFeignClient.getPullRequestListInfo(any(), any(), any()))
			.thenReturn(List.of(pullRequestInfoWithDifferentSha));
		when(gitHubFeignClient.getPullRequestCommitInfo(any(), any(), any())).thenReturn(List.of(commitInfo));
		when(gitHubFeignClient.getCommitInfo(any(), any(), any())).thenReturn(commitInfo);

		List<PipelineLeadTime> result = githubService.fetchPipelinesLeadTime(deployTimes, repositoryMap, mockToken);

		assertEquals(expect, result);
	}

	@Test
	void shouldReturnEmptyMergeLeadTimeWhenPullRequestInfoIsEmpty() {
		String mockToken = "mockToken";
		List<PipelineLeadTime> expect = List.of(PipelineLeadTime.builder()
			.pipelineStep(PIPELINE_STEP)
			.pipelineName("Name")
			.leadTimes(List.of(LeadTime.builder()
				.commitId("111")
				.jobStartTime(1658549040000L)
				.jobFinishTime(1658549160000L)
				.pipelineCreateTime(1658549100000L)
				.prLeadTime(0L)
				.pipelineLeadTime(120000)
				.totalTime(120000)
				.firstCommitTime(1658549040000L)
				.isRevert(null)
				.build()))
			.build());
		when(gitHubFeignClient.getPullRequestListInfo(any(), any(), any())).thenReturn(List.of());
		when(gitHubFeignClient.getPullRequestCommitInfo(any(), any(), any())).thenReturn(List.of());
		when(gitHubFeignClient.getCommitInfo(any(), any(), any())).thenReturn(new CommitInfo());

		List<PipelineLeadTime> result = githubService.fetchPipelinesLeadTime(deployTimes, repositoryMap, mockToken);

		assertEquals(expect, result);
	}

	@Test
	void shouldReturnEmptyMergeLeadTimeWhenPullRequestInfoGot404Error() {
		String mockToken = "mockToken";
		List<PipelineLeadTime> expect = List.of(PipelineLeadTime.builder()
			.pipelineStep(PIPELINE_STEP)
			.pipelineName("Name")
			.leadTimes(List.of(LeadTime.builder()
				.commitId("111")
				.jobStartTime(1658549040000L)
				.jobFinishTime(1658549160000L)
				.pipelineCreateTime(1658549100000L)
				.prLeadTime(0L)
				.pipelineLeadTime(120000)
				.firstCommitTime(1658549040000L)
				.totalTime(120000)
				.isRevert(Boolean.FALSE)
				.build()))
			.build());
		when(gitHubFeignClient.getPullRequestListInfo(any(), any(), any())).thenThrow(new NotFoundException(""));
		when(gitHubFeignClient.getPullRequestCommitInfo(any(), any(), any())).thenReturn(List.of());
		when(gitHubFeignClient.getCommitInfo(any(), any(), any()))
			.thenReturn(CommitInfo.builder().commit(Commit.builder().message("").build()).build());

		List<PipelineLeadTime> result = githubService.fetchPipelinesLeadTime(deployTimes, repositoryMap, mockToken);

		assertEquals(expect, result);
	}

	@Test
	void shouldReturnEmptyMergeLeadTimeWhenMergeTimeIsEmpty() {
		String mockToken = "mockToken";
		pullRequestInfo.setMergedAt(null);
		List<PipelineLeadTime> expect = List.of(PipelineLeadTime.builder()
			.pipelineStep(PIPELINE_STEP)
			.pipelineName("Name")
			.leadTimes(List.of(LeadTime.builder()
				.commitId("111")
				.jobStartTime(1658549040000L)
				.jobFinishTime(1658549160000L)
				.pipelineCreateTime(1658549100000L)
				.prLeadTime(0L)
				.pipelineLeadTime(120000)
				.firstCommitTime(1658549040000L)
				.totalTime(120000)
				.isRevert(null)
				.build()))
			.build());
		when(gitHubFeignClient.getPullRequestListInfo(any(), any(), any())).thenReturn(List.of(pullRequestInfo));
		when(gitHubFeignClient.getPullRequestCommitInfo(any(), any(), any())).thenReturn(List.of());
		when(gitHubFeignClient.getCommitInfo(any(), any(), any())).thenReturn(new CommitInfo());

		List<PipelineLeadTime> result = githubService.fetchPipelinesLeadTime(deployTimes, repositoryMap, mockToken);

		assertEquals(expect, result);
	}

	@Test
	void shouldThrowExceptionIfGetPullRequestListInfoHasExceptionWhenFetchPipelinesLeadTime() {
		String mockToken = "mockToken";
		pullRequestInfo.setMergedAt(null);
		when(gitHubFeignClient.getPullRequestListInfo(any(), any(), any()))
			.thenThrow(new CompletionException(new Exception("UnExpected Exception")));
		when(gitHubFeignClient.getPullRequestCommitInfo(any(), any(), any())).thenReturn(List.of());

		assertThatThrownBy(() -> githubService.fetchPipelinesLeadTime(deployTimes, repositoryMap, mockToken))
			.isInstanceOf(InternalServerErrorException.class)
			.hasMessageContaining("UnExpected Exception");
	}

	@Test
	void shouldThrowCompletableExceptionIfGetPullRequestListInfoHasExceptionWhenFetchPipelinesLeadTime() {
		String mockToken = "mockToken";
		pullRequestInfo.setMergedAt(null);
		when(gitHubFeignClient.getPullRequestListInfo(any(), any(), any()))
			.thenThrow(new CompletionException(new UnauthorizedException("Bad credentials")));
		when(gitHubFeignClient.getPullRequestCommitInfo(any(), any(), any())).thenReturn(List.of());

		assertThatThrownBy(() -> githubService.fetchPipelinesLeadTime(deployTimes, repositoryMap, mockToken))
			.isInstanceOf(UnauthorizedException.class)
			.hasMessageContaining("Bad credentials");
	}

	@Test
	void shouldFetchCommitInfo() {
		CommitInfo commitInfo = CommitInfo.builder()
			.commit(Commit.builder()
				.author(Author.builder().name("XXXX").email("XXX@test.com").date("2023-05-10T06:43:02.653Z").build())
				.committer(
						Committer.builder().name("XXXX").email("XXX@test.com").date("2023-05-10T06:43:02.653Z").build())
				.build())
			.build();
		when(gitHubFeignClient.getCommitInfo(anyString(), anyString(), anyString())).thenReturn(commitInfo);

		CommitInfo result = githubService.fetchCommitInfo("12344", "org/repo", "mockToken");

		assertEquals(result, commitInfo);
	}

	@Test
    void shouldThrowPermissionDenyExceptionWhenFetchCommitInfo403Forbidden() {
        when(gitHubFeignClient.getCommitInfo(anyString(), anyString(), anyString()))
                .thenThrow(new PermissionDenyException("request forbidden"));

        assertThatThrownBy(() -> githubService.fetchCommitInfo("12344", "org/repo", "mockToken"))
                .isInstanceOf(PermissionDenyException.class)
                .hasMessageContaining("request forbidden");
    }

	@Test
	void shouldThrowInternalServerErrorExceptionWhenFetchCommitInfo500Exception() {
		when(gitHubFeignClient.getCommitInfo(anyString(), anyString(), anyString())).thenReturn(null);

		assertThatThrownBy(() -> githubService.fetchCommitInfo("12344", "", ""))
			.isInstanceOf(InternalServerErrorException.class)
			.hasMessageContaining("Failed to get commit info_repoId");
	}

	@Test
	void shouldReturnNullWhenFetchCommitInfo404Exception() {
		when(gitHubFeignClient.getCommitInfo(anyString(), anyString(), anyString())).thenThrow(new NotFoundException(""));

		assertNull(githubService.fetchCommitInfo("12344", "", ""));
	}

	@Test
	void shouldReturnPipeLineLeadTimeWhenDeployITimesIsNotEmptyAndCommitInfoError() {
		String mockToken = "mockToken";
		when(gitHubFeignClient.getPullRequestListInfo(any(), any(), any())).thenReturn(List.of(pullRequestInfo));
		when(gitHubFeignClient.getPullRequestCommitInfo(any(), any(), any())).thenReturn(List.of(commitInfo));
		when(gitHubFeignClient.getCommitInfo(any(), any(), any()))
			.thenThrow(new NotFoundException("Failed to get commit"));

		List<PipelineLeadTime> result = githubService.fetchPipelinesLeadTime(deployTimes, repositoryMap, mockToken);

		assertEquals(pipelineLeadTimes, result);
	}

	@Test
	void shouldReturnPipeLineLeadTimeWhenDeployCommitShaIsDifferent() {
		String mockToken = "mockToken";
		pullRequestInfo = PullRequestInfo.builder()
			.mergedAt("2022-07-23T04:04:00.000+00:00")
			.createdAt("2022-07-23T04:03:00.000+00:00")
			.mergeCommitSha("222")
			.url("")
			.number(1)
			.build();
		pipelineLeadTimes = List.of(PipelineLeadTime.builder()
			.pipelineName("Name")
			.pipelineStep(PIPELINE_STEP)
			.leadTimes(List.of(LeadTime.builder()
				.commitId("111")
				.jobStartTime(1658549040000L)
				.jobFinishTime(1658549160000L)
				.pipelineLeadTime(1658549100000L)
				.pipelineCreateTime(1658549100000L)
				.prLeadTime(0L)
				.pipelineLeadTime(120000)
				.firstCommitTime(1658549040000L)
				.totalTime(120000)
				.isRevert(null)
				.build()))
			.build());
		when(gitHubFeignClient.getPullRequestListInfo(any(), any(), any())).thenReturn(List.of(pullRequestInfo));
		when(gitHubFeignClient.getPullRequestCommitInfo(any(), any(), any())).thenReturn(List.of(commitInfo));
		when(gitHubFeignClient.getCommitInfo(any(), any(), any()))
			.thenThrow(new NotFoundException("Failed to get commit"));

		List<PipelineLeadTime> result = githubService.fetchPipelinesLeadTime(deployTimes, repositoryMap, mockToken);

		assertEquals(pipelineLeadTimes, result);
	}

}
