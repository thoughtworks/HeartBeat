package heartbeat.controller.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadTimeForChangesOfPipelines {

	private String name;

	private String step;

	private Double prLeadTime;

	private Double pipelineLeadTime;

	private Double totalDelayTime;

}
