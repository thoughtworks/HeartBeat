package heartbeat.controller.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@EqualsAndHashCode
public class MetricsDataCompleted {

	private Boolean boardMetricsCompleted;

	private Boolean pipelineMetricsCompleted;

	private Boolean sourceControlMetricsCompleted;

	public Boolean boardMetricsCompleted() {
		return boardMetricsCompleted;
	}

	public Boolean pipelineMetricsCompleted() {
		return pipelineMetricsCompleted;
	}

	public Boolean sourceControlMetricsCompleted() {
		return sourceControlMetricsCompleted;
	}

}
