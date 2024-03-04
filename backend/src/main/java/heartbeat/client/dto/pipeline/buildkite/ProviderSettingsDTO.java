package heartbeat.client.dto.pipeline.buildkite;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProviderSettingsDTO implements Serializable {

	@JsonProperty("trigger_mode")
	private String triggerMode;

	@JsonProperty("build_pull_requests")
	private boolean buildPullRequests;

	@JsonProperty("pull_request_branch_filter_enabled")
	private boolean pullRequestBranchFilterEnabled;

	@JsonProperty("skip_builds_for_existing_commits")
	private boolean skipBuildsForExistingCommits;

	@JsonProperty("skip_pull_request_builds_for_existing_commits")
	private boolean skipPullRequestBuildsForExistingCommits;

	@JsonProperty("build_pull_request_ready_for_review")
	private boolean buildPullRequestReadyForReview;

	@JsonProperty("build_pull_request_labels_changed")
	private boolean buildPullRequestLabelsChanged;

	@JsonProperty("build_pull_request_base_branch_changed")
	private boolean buildPullRequestBaseBranchChanged;

	@JsonProperty("build_pull_request_forks")
	private boolean buildPullRequestForks;

	@JsonProperty("prefix_pull_request_fork_branch_names")
	private boolean prefixPullRequestForkBranchNames;

	@JsonProperty("build_branches")
	private boolean buildBranches;

	@JsonProperty("build_tags")
	private boolean buildTags;

	@JsonProperty("cancel_deleted_branch_builds")
	private boolean cancelDeletedBranchBuilds;

	@JsonProperty("publish_commit_status")
	private boolean publishCommitStatus;

	@JsonProperty("publish_commit_status_per_step")
	private boolean publishCommitStatusPerStep;

	@JsonProperty("separate_pull_request_statuses")
	private boolean separatePullRequestStatuses;

	@JsonProperty("publish_blocked_as_pending")
	private boolean publishBlockedAsPending;

	@JsonProperty("use_step_key_as_commit_status")
	private boolean useStepKeyAsCommitStatus;

	@JsonProperty("filter_enabled")
	private boolean filterEnabled;

	private String repository;

}
