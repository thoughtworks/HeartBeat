package heartbeat.controller.report.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MeanTimeToRecoveryOfPipeline {

	@JsonProperty("name")
	private String pipelineName;

	@JsonProperty("step")
	private String pipelineStep;

	private BigDecimal timeToRecovery;

}
