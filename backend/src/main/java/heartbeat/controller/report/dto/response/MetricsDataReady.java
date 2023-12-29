package heartbeat.controller.report.dto.response;

import lombok.*;

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
