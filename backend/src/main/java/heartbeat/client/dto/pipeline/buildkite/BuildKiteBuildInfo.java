package heartbeat.client.dto.pipeline.buildkite;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BuildKiteBuildInfo implements Serializable {

	private String state;

	private List<BuildKiteJob> jobs;

	private String commit;

	@JsonProperty("created_at")
	private String pipelineCreateTime;

	private int number;

	private Author author;

	private Creator creator;

	private String branch;

	@Data
	@JsonIgnoreProperties(ignoreUnknown = true)
	@AllArgsConstructor
	@NoArgsConstructor
	@Builder
	public static class Author implements Serializable {

		private String username;

		private String name;

		private String email;

	}

	@Data
	@JsonIgnoreProperties(ignoreUnknown = true)
	@AllArgsConstructor
	@NoArgsConstructor
	@Builder
	public static class Creator implements Serializable {

		private String userName;

		private String name;

		private String email;

	}

}
