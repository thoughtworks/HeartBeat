package heartbeat.controller.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MeanTimeToRecoveryOfPipeline {

	private String pipelineName;

	private String pipelineStep;

	private double meanTimeToRecovery;

}
