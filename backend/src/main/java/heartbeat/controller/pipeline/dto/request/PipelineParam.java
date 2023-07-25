package heartbeat.controller.pipeline.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PipelineParam {

	@Valid
	@NotBlank(message = "Token cannot be empty.")
	private String token;

	@NotBlank(message = "StartTime is required")
	private String startTime;

	@NotBlank(message = "EndTime is required")
	private String endTime;

}
