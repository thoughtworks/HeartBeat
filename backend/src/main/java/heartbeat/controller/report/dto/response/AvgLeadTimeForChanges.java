package heartbeat.controller.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvgLeadTimeForChanges {

	@Builder.Default
	private String name = "Average";

	private Double prLeadTime;

	private Double pipelineLeadTime;

	private Double totalDelayTime;

}
