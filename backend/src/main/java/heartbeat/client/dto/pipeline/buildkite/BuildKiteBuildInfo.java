package heartbeat.client.dto.pipeline.buildkite;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Objects;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BuildKiteBuildInfo {

	private List<BuildKiteJob> jobs;

	private String commit;

	@JsonProperty("created_at")
	private String pipelineCreateTime;

	private int number;

	public DeployInfo mapToDeployInfo(String step, String states) {
		BuildKiteJob job = this.jobs.stream()
			.filter(item -> Objects.equals(item.getName(), step) && Objects.equals(states, item.getState()))
			.findFirst()
			.orElse(null);

		if (this.pipelineCreateTime == null || job == null || job.getStartedAt() == null
				|| job.getFinishedAt() == null) {
			return DeployInfo.builder().build();
		}

		return new DeployInfo(this.pipelineCreateTime, job.getStartedAt(), job.getFinishedAt(), this.commit,
				job.getState());
	}

}
