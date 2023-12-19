package heartbeat.controller.report.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.val;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class GenerateBoardReportRequest {

	private Boolean considerHoliday;

	@NotBlank(message = "StartTime is required")
	private String startTime;

	@NotBlank(message = "EndTime is required")
	private String endTime;

	private List<String> metrics;

	private JiraBoardSetting jiraBoardSetting;

	@NotBlank
	private String csvTimeStamp;

	public GenerateReportRequest convertToReportRequest() {
		return GenerateReportRequest.builder()
			.considerHoliday(this.considerHoliday)
			.startTime(this.startTime)
			.endTime(this.endTime)
			.metrics(this.metrics)
			.jiraBoardSetting(this.jiraBoardSetting)
			.csvTimeStamp(this.csvTimeStamp)
			.build();
	}

}
