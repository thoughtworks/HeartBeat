package heartbeat.service.source.github.model;

import heartbeat.client.dto.pipeline.buildkite.DeployInfo;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class PipelineInfoOfRepository {

	private String repository;

	private List<DeployInfo> passedDeploy;

	private String pipelineName;

	private String pipelineStep;

}
