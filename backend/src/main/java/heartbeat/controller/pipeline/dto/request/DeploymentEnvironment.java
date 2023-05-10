package heartbeat.controller.pipeline.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeploymentEnvironment {

	private String orgId;

	private String orgName;

	private String id;

	private String name;

	private String step;

}