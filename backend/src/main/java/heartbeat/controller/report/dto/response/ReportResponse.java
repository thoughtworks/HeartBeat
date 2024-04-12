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

	private DevChangeFailureRate devChangeFailureRate;

	private DevMeanTimeToRecovery devMeanTimeToRecovery;

	private LeadTimeForChanges leadTimeForChanges;

	private ReportMetricsError reportMetricsError;

	private Rework rework;

	private Long exportValidityTime;

	private Boolean boardMetricsCompleted;

	private Boolean doraMetricsCompleted;

	private Boolean overallMetricsCompleted;

	private Boolean allMetricsCompleted;

	private Boolean isSuccessfulCreateCsvFile;

	public ReportResponse(Long exportValidityTime) {
		this.exportValidityTime = exportValidityTime;
	}

}
