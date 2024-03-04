package heartbeat.controller.report.dto.request;

import heartbeat.controller.pipeline.dto.request.DeploymentEnvironment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuildKiteSetting {

	private String type;

	private String token;

	private List<DeploymentEnvironment> deploymentEnvList;

	private List<String> pipelineCrews;

}
