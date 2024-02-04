package heartbeat.client.dto.pipeline.buildkite;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeployInfo {

	private String pipelineCreateTime;

	private String jobStartTime;

	private String jobFinishTime;

	private String commitId;

	private String state;

	private boolean isPipelineCanceled;

	private String jobName;

}
