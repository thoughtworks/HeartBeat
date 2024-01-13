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

	private Boolean isBoardMetricsReady;

	private Boolean isPipelineMetricsReady;

	private Boolean isSourceControlMetricsReady;

	public Boolean boardMetricsCompleted() {
		return isBoardMetricsReady;
	}

	public Boolean pipelineMetricsCompleted() {
		return isPipelineMetricsReady;
	}

	public Boolean sourceControlMetricsCompleted() {
		return isSourceControlMetricsReady;
	}

}
