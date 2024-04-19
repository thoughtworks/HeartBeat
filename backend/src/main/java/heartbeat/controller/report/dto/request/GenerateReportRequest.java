package heartbeat.controller.report.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import heartbeat.util.IdUtil;
import heartbeat.util.MetricsUtil;
import heartbeat.util.TimeUtil;
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

	private List<MetricType> metricTypes;

	private JiraBoardSetting jiraBoardSetting;

	private BuildKiteSetting buildKiteSetting;

	private CodebaseSetting codebaseSetting;

	@NotBlank
	private String csvTimeStamp;

	@JsonIgnore
	public List<String> getPipelineMetrics() {
		return this.metrics.stream()
			.map(String::toLowerCase)
			.filter(MetricsUtil.BUILDKITE_METRICS.getValue()::contains)
			.toList();
	}

	public List<String> getMetrics() {
		return this.metrics.stream().map(String::toLowerCase).toList();
	}

	@JsonIgnore
	public List<String> getSourceControlMetrics() {
		return this.metrics.stream()
			.map(String::toLowerCase)
			.filter(MetricsUtil.CODEBASE_METRICS.getValue()::contains)
			.toList();
	}

	@JsonIgnore
	public List<String> getBoardMetrics() {
		return this.metrics.stream()
			.map(String::toLowerCase)
			.filter(MetricsUtil.KANBAN_METRICS.getValue()::contains)
			.toList();
	}

	@JsonIgnore
	public String getTimeRangeAndTimeStamp() {
		return TimeUtil.convertToChinaSimpleISOFormat(Long.parseLong(this.startTime)) + "-"
				+ TimeUtil.convertToChinaSimpleISOFormat(Long.parseLong(this.endTime)) + "-" + this.csvTimeStamp;

	}

	@JsonIgnore
	public String getPipelineReportFileId() {
		return IdUtil.getPipelineReportFileId(this.getTimeRangeAndTimeStamp());
	}

	@JsonIgnore
	public String getSourceControlReportFileId() {
		return IdUtil.getSourceControlReportFileId(this.getTimeRangeAndTimeStamp());
	}

	@JsonIgnore
	public String getBoardReportFileId() {
		return IdUtil.getBoardReportFileId(this.getTimeRangeAndTimeStamp());
	}

	@JsonIgnore
	public GenerateReportRequest toPipelineRequest() {
		return GenerateReportRequest.builder()
			.startTime(this.startTime)
			.endTime(this.endTime)
			.considerHoliday(this.considerHoliday)
			.metrics(this.getPipelineMetrics())
			.codebaseSetting(this.codebaseSetting)
			.buildKiteSetting(this.buildKiteSetting)
			.csvTimeStamp(this.csvTimeStamp)
			.build();
	}

	@JsonIgnore
	public GenerateReportRequest toSourceControlRequest() {
		return GenerateReportRequest.builder()
			.startTime(this.startTime)
			.endTime(this.endTime)
			.considerHoliday(this.considerHoliday)
			.metrics(this.getSourceControlMetrics())
			.codebaseSetting(this.codebaseSetting)
			.buildKiteSetting(this.buildKiteSetting)
			.csvTimeStamp(this.csvTimeStamp)
			.build();
	}

}
