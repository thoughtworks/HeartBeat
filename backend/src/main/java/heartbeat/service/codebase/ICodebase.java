package heartbeat.service.codebase;

import heartbeat.client.dto.codebase.github.PipelineLeadTime;
import heartbeat.client.dto.pipeline.buildkite.DeployTimes;

import java.util.List;
import java.util.Map;

public interface ICodebase {

	public List<PipelineLeadTime> fetchPipelinesLeadTime(List<DeployTimes> deployTimes,
			Map<String, String> repositories);

}
