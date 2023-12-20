package heartbeat.controller.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MetricsDataReady {

	private Boolean boardMetricsReady;

	private Boolean pipelineMetricsReady;

	private Boolean sourceControlMetricsReady;

}
