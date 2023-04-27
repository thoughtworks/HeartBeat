package heartbeat.client.dto.codebase.github;

import heartbeat.client.dto.pipeline.buildkite.DeployInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadTime {

	private String commitId;

	private long prCreatedTime;

	private long prMergedTime;

	private long firstCommitTimeInPr;

	private long jobFinishTime;

	private long pipelineCreateTime;

	private long prDelayTime;

	private long pipelineDelayTime;

	private long totalTime;

	public LeadTime(String commitId, Long pipelineCreateTime, Long jobFinishTime, Long prCreatedTime, Long prMergedTime, Long firstCommitTimeInPr) {
		this.commitId = commitId;
		this.prCreatedTime = prCreatedTime;
		this.prMergedTime = prMergedTime;
		this.jobFinishTime = jobFinishTime;
		this.pipelineCreateTime = pipelineCreateTime;
		this.firstCommitTimeInPr = firstCommitTimeInPr;
		this.pipelineDelayTime = jobFinishTime - pipelineCreateTime;

		if (prMergedTime != null && prCreatedTime != null) {
			if (firstCommitTimeInPr != null) {
				this.prDelayTime = prMergedTime - firstCommitTimeInPr;
			} else {
				this.prDelayTime = prMergedTime - prCreatedTime;
			}
			this.totalTime = this.prDelayTime + this.pipelineDelayTime;
		} else {
			this.totalTime = this.pipelineDelayTime;
		}
	}

	public static LeadTime mapFrom(GitHubPull gitHubPull, DeployInfo deployInfo, CommitInfo firstCommit) throws Exception {
		if (gitHubPull.getMergedAt() == null) {
			throw new Exception("this commit has not been merged");
		}
		long prCreatedTime = Instant.parse(gitHubPull.getCreatedAt()).toEpochMilli();
		long prMergedTime = Instant.parse(gitHubPull.getMergedAt()).toEpochMilli();
		long jobFinishTime = Instant.parse(deployInfo.getJobFinishTime()).toEpochMilli();
		long pipelineCreateTime = Instant.parse(deployInfo.getPipelineCreateTime()).toEpochMilli();
		Long firstCommitTimeInPr = null;
		if (firstCommit.getCommit() != null && firstCommit.getCommit().getCommitter() != null && firstCommit.getCommit().getCommitter().getDate() != null) {
			firstCommitTimeInPr = Instant.parse(firstCommit.getCommit().getCommitter().getDate()).toEpochMilli();
		}

		return new LeadTime(
			deployInfo.getCommitId(),
			pipelineCreateTime,
			jobFinishTime,
			prCreatedTime,
			prMergedTime,
			firstCommitTimeInPr
		);
	}


}
