package heartbeat.controller.pipeline.dto.request;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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

	@Nullable
	private String repository;

	private List<String> branches;

}
