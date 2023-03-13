package heartbeat.client.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class StepsDTO {

	private String type;

	private String name;

	private String command;

	private String artifact_paths;

	private String branch_configuration;

	private List<String> env;

	private Integer timeout_in_minutes;

	private String[] agent_query_rules;

	private Integer concurrency;

	private Integer parallelism;

}
