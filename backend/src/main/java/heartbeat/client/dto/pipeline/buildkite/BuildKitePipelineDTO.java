package heartbeat.client.dto.pipeline.buildkite;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class BuildKitePipelineDTO implements Serializable {

	private String id;

	@JsonProperty("graphql_id")
	private String graphqlId;

	private String url;

	@JsonProperty("web_url")
	private String webUrl;

	private String name;

	private String description;

	private String slug;

	private String repository;

	@JsonProperty("cluster_id")
	private String clusterId;

	@JsonProperty("branch_configuration")
	private String branchConfiguration;

	@JsonProperty("default_branch")
	private String defaultBranch;

	@JsonProperty("skip_queued_branch_builds")
	private String skipQueuedBranchBuilds;

	@JsonProperty("skip_queued_branch_builds_filter")
	private String skipQueuedBranchBuildsFilter;

	@JsonProperty("cancel_running_branch_builds")
	private String cancelRunningBranchBuilds;

	@JsonProperty("cancel_running_branch_builds_filter")
	private String cancelRunningBranchBuildsFilter;

	@JsonProperty("allow_rebuilds")
	private String allowRebuilds;

	private ProviderDTO provider;

	@JsonProperty("builds_url")
	private String buildsUrl;

	@JsonProperty("badge_url")
	private String badgeUrl;

	private CreatedByDTO createdBy;

	@JsonProperty("created_at")
	private Date createdAt;

	@JsonProperty("archived_at")
	private Date archivedAt;

	private EnvDTO env;

	@JsonProperty("scheduled_builds_count")
	private int scheduledBuildsCount;

	@JsonProperty("running_builds_count")
	private int runningBuildsCount;

	@JsonProperty("scheduled_jobs_count")
	private int scheduledJobsCount;

	@JsonProperty("running_jobs_count")
	private int runningJobsCount;

	@JsonProperty("waiting_jobs_count")
	private int waitingJobsCount;

	private String visibility;

	private List<String> tags;

	private List<StepsDTO> steps;

}
