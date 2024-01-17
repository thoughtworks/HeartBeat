package heartbeat.controller.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportMetricsError {

	private ErrorInfo boardMetricsError;

	private ErrorInfo pipelineMetricsError;

	private ErrorInfo sourceControlMetricsError;

}
