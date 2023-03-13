package heartbeat.client.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class PipelineDTO {

	private String id;

	private String graphql_id;

	private String url;

	private String web_url;

	private String name;

	private String description;

	private String slug;

	private String repository;

	private String cluster_id;

	private String branch_configuration;

	private String default_branch;

	private boolean skip_queued_branch_builds;

	private boolean skip_queued_branch_builds_filter;

	private boolean cancel_running_branch_builds;

	private boolean cancel_running_branch_builds_filter;

	private boolean allow_rebuilds;

	private ProviderDTO provider;

	private String builds_url;

	private String badge_url;

	private CreatedByDTO created_by;

	private Date created_at;

	private Date archived_at;

	private List<String> env;

	private int scheduled_builds_count;

	private int running_builds_count;

	private int scheduled_jobs_count;

	private int running_jobs_count;

	private int waiting_jobs_count;

	private String visibility;

	private List<String> tags;

	private List<StepsDTO> steps;

}
