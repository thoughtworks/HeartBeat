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

	private double prCreatedTime;

	private double prMergedTime;

	private double firstCommitTimeInPr;

	private double jobFinishTime;

	private double pipelineCreateTime;

	private double prDelayTime;

	private double pipelineDelayTime;

	private double totalTime;

	public double getPrDelayTime() {
		return prDelayTime;
	}

	public double getPipelineDelayTime() {
		return pipelineDelayTime;
	}

	public LeadTime(String commitId, Double pipelineCreateTime, Double jobFinishTime, Double prCreatedTime,
			Double prMergedTime, Double firstCommitTimeInPr) {
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
			}
			else {
				this.prDelayTime = prMergedTime - prCreatedTime;
			}
			this.totalTime = this.prDelayTime + this.pipelineDelayTime;
		}
		else {
			this.totalTime = this.pipelineDelayTime;
		}
	}

	public static LeadTime mapFrom(PullRequestInfo gitHubPull, DeployInfo deployInfo, CommitInfo firstCommit)
			throws Exception {
		if (gitHubPull.getMergedAt() == null) {
			throw new Exception("this commit has not been merged");
		}
		double prCreatedTime = Instant.parse(gitHubPull.getCreatedAt()).toEpochMilli();
		double prMergedTime = Instant.parse(gitHubPull.getMergedAt()).toEpochMilli();
		double jobFinishTime = Instant.parse(deployInfo.getJobFinishTime()).toEpochMilli();
		double pipelineCreateTime = Instant.parse(deployInfo.getPipelineCreateTime()).toEpochMilli();
		Double firstCommitTimeInPr = null;
		if (firstCommit.getCommit() != null && firstCommit.getCommit().getCommitter() != null
				&& firstCommit.getCommit().getCommitter().getDate() != null) {
			firstCommitTimeInPr = (double) Instant.parse(firstCommit.getCommit().getCommitter().getDate())
				.toEpochMilli();
		}

		return new LeadTime(deployInfo.getCommitId(), pipelineCreateTime, jobFinishTime, prCreatedTime, prMergedTime,
				firstCommitTimeInPr);
	}

}
