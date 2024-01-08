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
public class StepsDTO implements Serializable {

	private String type;

	private String name;

	private String command;

	@JsonProperty("artifact_paths")
	private String artifactPaths;

	@JsonProperty("branch_configuration")
	private String branchConfiguration;

	private EnvDTO env;

	@JsonProperty("timeout_in_minutes")
	private Integer timeoutInMinutes;

	@JsonProperty("agent_query_rules")
	private String[] agentQueryRules;

	private Integer concurrency;

	private Integer parallelism;

}
