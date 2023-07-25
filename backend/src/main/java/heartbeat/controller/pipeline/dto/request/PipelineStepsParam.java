package heartbeat.controller.pipeline.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PipelineStepsParam {

	@NotBlank(message = "PipelineName is required")
	private String pipelineName;

	@NotBlank(message = "Repository is required")
	private String repository;

	@NotBlank(message = "OrgName is required")
	private String orgName;

	@NotBlank(message = "StartTime is required")
	private String startTime;

	@NotBlank(message = "EndTime is required")
	private String endTime;

}
