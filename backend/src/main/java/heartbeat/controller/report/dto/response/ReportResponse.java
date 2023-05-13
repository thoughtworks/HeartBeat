package heartbeat.controller.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {

	private Velocity velocity;

	private CycleTime cycleTime;

	private DeploymentFrequency deploymentFrequency;

	private ChangeFailureRate changeFailureRate;

}
