package heartbeat.client.dto.pipeline.buildkite;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeployTimes {

	private String pipelineId;

	private String pipelineName;

	private String pipelineStep;

	private List<DeployInfo> passed;

	private List<DeployInfo> failed;

}
