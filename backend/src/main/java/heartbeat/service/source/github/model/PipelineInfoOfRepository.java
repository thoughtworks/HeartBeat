package heartbeat.service.source.github.model;

import heartbeat.client.dto.pipeline.buildkite.DeployInfo;
import lombok.Builder;

import java.util.List;

@Builder
public class PipelineInfoOfRepository {
	private String repository;
	private List<DeployInfo> passedDeploy;

	private String pipelineName;

	private String pipelineStep;

	public String getRepository() {
		return repository;
	}

	public List<DeployInfo> getPassedDeploy() {
		return passedDeploy;
	}

	public String getPipelineName() {
		return pipelineName;
	}

	public String getPipelineStep() {
		return pipelineStep;
	}
}
