package heartbeat.controller.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {

	private Velocity velocity;

	private List<Classification> classificationList;

	private CycleTime cycleTime;

	private DeploymentFrequency deploymentFrequency;

	private ChangeFailureRate changeFailureRate;

	private MeanTimeToRecovery meanTimeToRecovery;

	private LeadTimeForChanges leadTimeForChanges;

	private ReportMetricsError reportMetricsError;

	private Long exportValidityTime;

	private boolean boardMetricsCompleted;

	private boolean doraMetricsCompleted;

	private boolean allMetricsCompleted;

	public ReportResponse(Long exportValidityTime) {
		this.exportValidityTime = exportValidityTime;
	}

}
