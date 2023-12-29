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
public class MetricsDataReady {

	private Boolean isBoardMetricsReady;

	private Boolean isPipelineMetricsReady;

	private Boolean isSourceControlMetricsReady;

	public Boolean isBoardMetricsReady() {
		return isBoardMetricsReady;
	}

	public Boolean isPipelineMetricsReady() {
		return isPipelineMetricsReady;
	}

	public Boolean isSourceControlMetricsReady() {
		return isSourceControlMetricsReady;
	}

}
