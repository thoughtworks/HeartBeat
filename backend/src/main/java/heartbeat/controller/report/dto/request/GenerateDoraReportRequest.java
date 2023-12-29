package heartbeat.controller.report.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class GenerateDoraReportRequest {

	private Boolean considerHoliday;

	@NotBlank(message = "StartTime is required")
	private String startTime;

	@NotBlank(message = "EndTime is required")
	private String endTime;

	private List<String> metrics;

	private BuildKiteSetting buildKiteSetting;

	private CodebaseSetting codebaseSetting;

	@NotBlank
	private String csvTimeStamp;

	public GenerateReportRequest convertToReportRequest() {
		GenerateReportRequest reportRequest = new GenerateReportRequest();
		reportRequest.setConsiderHoliday(this.considerHoliday);
		reportRequest.setStartTime(this.startTime);
		reportRequest.setEndTime(this.endTime);
		reportRequest.setMetrics(this.metrics);
		reportRequest.setBuildKiteSetting(this.buildKiteSetting);
		reportRequest.setCodebaseSetting(this.codebaseSetting);
		reportRequest.setCsvTimeStamp(this.csvTimeStamp);
		return reportRequest;
	}

}
