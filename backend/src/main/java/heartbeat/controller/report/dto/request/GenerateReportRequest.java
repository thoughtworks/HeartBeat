package heartbeat.controller.report.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.google.gson.Gson;
import heartbeat.util.MetricsUtil;
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
public class GenerateReportRequest {

	private Boolean considerHoliday;

	@NotBlank(message = "StartTime is required")
	private String startTime;

	@NotBlank(message = "EndTime is required")
	private String endTime;

	private List<String> metrics;

	private JiraBoardSetting jiraBoardSetting;

	private BuildKiteSetting buildKiteSetting;

	private CodebaseSetting codebaseSetting;

	@NotBlank
	private String csvTimeStamp;

	public GenerateReportRequest convertToPipelineRequest(GenerateReportRequest request) {
		List<String> pipelineMetrics = MetricsUtil
			.getPipelineMetrics(request.getMetrics().stream().map(String::toLowerCase).toList());
		Gson gson = new Gson();
		GenerateReportRequest result = gson.fromJson(gson.toJson(request), GenerateReportRequest.class);

		result.setMetrics(pipelineMetrics);
		return result;
	}

	public GenerateReportRequest convertToSourceControlRequest(GenerateReportRequest request) {
		List<String> codebaseMetrics = MetricsUtil
			.getCodeBaseMetrics(request.getMetrics().stream().map(String::toLowerCase).toList());
		Gson gson = new Gson();
		GenerateReportRequest result = gson.fromJson(gson.toJson(request), GenerateReportRequest.class);
		result.setMetrics(codebaseMetrics);
		return result;
	}

}
