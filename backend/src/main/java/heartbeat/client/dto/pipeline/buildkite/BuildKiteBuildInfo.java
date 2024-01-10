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

	public BuildKiteJob getBuildKiteJob(List<BuildKiteJob> jobs, List<String> steps, List<String> states,
			String startTime, String endTime) {
		Instant startDate = Instant.ofEpochMilli(Long.parseLong(startTime));
		Instant endDate = Instant.ofEpochMilli(Long.parseLong(endTime));
		return jobs.stream().filter(item -> steps.contains(item.getName())).filter(item -> {
			if (Objects.nonNull(item.getFinishedAt()) && Objects.nonNull(item.getStartedAt())) {
				Instant time = Instant.parse(item.getFinishedAt());
				return TimeUtil.isAfterAndEqual(startDate, time) && TimeUtil.isBeforeAndEqual(endDate, time);
			}
			return false;
		})
			.max(Comparator.comparing(BuildKiteJob::getFinishedAt))
			.filter(buildKiteJob -> states.contains(buildKiteJob.getState()))
			.orElse(null);
	}

	public DeployInfo mapToDeployInfo(List<String> steps, List<String> states, String startTime, String endTime) {
		BuildKiteJob job = getBuildKiteJob(this.jobs, steps, states, startTime, endTime);

		if (this.pipelineCreateTime == null || job == null || job.getStartedAt() == null
				|| job.getFinishedAt() == null) {
			return DeployInfo.builder().build();
		}

		return new DeployInfo(this.pipelineCreateTime, job.getStartedAt(), job.getFinishedAt(), this.commit,
				job.getState(), job.getName());
	}

}
