package heartbeat.controller.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportError {

	private ErrorInfo boardError;

	private ErrorInfo pipelineError;

	private ErrorInfo sourceControlError;

}
