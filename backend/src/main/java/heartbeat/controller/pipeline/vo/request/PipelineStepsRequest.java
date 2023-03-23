package heartbeat.controller.pipeline.vo.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PipelineStepsRequest {

	@NotBlank(message = "pipelineId is required")
	private String pipelineId;

	@NotBlank(message = "pipelineName is required")
	private String pipelineName;

	@NotBlank(message = "repository is required")
	private String repository;

	@NotBlank(message = "orgId is required")
	private String orgId;

	@NotBlank(message = "orgName is required")
	private String orgName;

	@NotBlank(message = "token is required")
	private String token;

	@NotBlank(message = "type is required")
	private String type;

	@NotBlank(message = "startTime is required")
	private String startTime;

	@NotBlank(message = "endTime is required")
	private String endTime;

}
