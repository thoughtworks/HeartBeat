package heartbeat.controller.report.dto.response;

import heartbeat.client.dto.codebase.github.CommitInfo;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteBuildInfo;
import heartbeat.client.dto.pipeline.buildkite.DeployInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PipelineCSVInfo {

	private String pipeLineName;

	private String stepName;

	private Boolean valid;

	private BuildKiteBuildInfo buildInfo;

	private DeployInfo deployInfo;

	private CommitInfo commitInfo;

	private LeadTimeInfo leadTimeInfo;

}
