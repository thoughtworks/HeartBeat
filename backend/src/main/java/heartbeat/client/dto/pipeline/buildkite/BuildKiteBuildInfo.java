package heartbeat.client.dto.pipeline.buildkite;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import heartbeat.util.TimeUtil;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BuildKiteBuildInfo implements Serializable {

	private List<BuildKiteJob> jobs;

	private String commit;

	@JsonProperty("created_at")
	private String pipelineCreateTime;

	private int number;

	private Author author;

	private String branch;

	@Data
	@JsonIgnoreProperties(ignoreUnknown = true)
	@AllArgsConstructor
	@NoArgsConstructor
	@Builder
	public static class Author implements Serializable {

		private String userName;

		private String name;

		private String email;

	}

}
