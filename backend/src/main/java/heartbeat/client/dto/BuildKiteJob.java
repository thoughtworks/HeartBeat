package heartbeat.client.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class BuildKiteJob {

	private String name;

	private String state;

	@JsonProperty("started_at")
	private String startedAt;

	@JsonProperty("finished_at")
	private String finishedAt;

}
