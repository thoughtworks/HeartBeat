package heartbeat.client.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProviderSettingsDTO {

	private String trigger_mode;

	private boolean build_pull_requests;

	private boolean pull_request_branch_filter_enabled;

	private boolean skip_builds_for_existing_commits;

	private boolean skip_pull_request_builds_for_existing_commits;

	private boolean build_pull_request_ready_for_review;

	private boolean build_pull_request_labels_changed;

	private boolean build_pull_request_base_branch_changed;

	private boolean build_pull_request_forks;

	private boolean prefix_pull_request_fork_branch_names;

	private boolean build_branches;

	private boolean build_tags;

	private boolean cancel_deleted_branch_builds;

	private boolean publish_commit_status;

	private boolean publish_commit_status_per_step;

	private boolean separate_pull_request_statuses;

	private boolean publish_blocked_as_pending;

	private boolean use_step_key_as_commit_status;

	private boolean filter_enabled;

	private String repository;

}
