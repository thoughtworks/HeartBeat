package heartbeat.client.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class BuildKiteBuildInfo {

	private List<BuildKiteJob> jobs;

	private String commit;

	@JsonProperty("created_at")
	private String pipelineCreateTime;

	private int number;

}
