package heartbeat.controller.report.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import heartbeat.controller.report.dto.response.MetricsDataCompleted;
import heartbeat.util.IdUtil;
import heartbeat.util.MetricsUtil;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.collections.CollectionUtils;

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

	@JsonIgnore
	public List<String> getPipelineMetrics() {
		return this.metrics.stream().map(String::toLowerCase).filter(MetricsUtil.buildKiteMetrics::contains).toList();
	}

	public List<String> getMetrics() {
		return this.metrics.stream().map(String::toLowerCase).toList();
	}

	@JsonIgnore
	public List<String> getSourceControlMetrics() {
		return this.metrics.stream().map(String::toLowerCase).filter(MetricsUtil.codebaseMetrics::contains).toList();
	}

	@JsonIgnore
	public List<String> getBoardMetrics() {
		return this.metrics.stream().map(String::toLowerCase).filter(MetricsUtil.kanbanMetrics::contains).toList();
	}

	@JsonIgnore
	public String getPipelineReportId() {
		return IdUtil.getPipelineReportId(this.csvTimeStamp);
	}

	@JsonIgnore
	public String getSourceControlReportId() {
		return IdUtil.getSourceControlReportId(this.csvTimeStamp);
	}

	@JsonIgnore
	public String getBoardReportId() {
		return IdUtil.getBoardReportId(this.csvTimeStamp);
	}

	@JsonIgnore
	public MetricsDataCompleted getMetricsStatus(Boolean flag) {
		return MetricsDataCompleted.builder()
			.boardMetricsCompleted(CollectionUtils.isNotEmpty(getBoardMetrics()) ? flag : null)
			.pipelineMetricsCompleted(CollectionUtils.isNotEmpty(getPipelineMetrics()) ? flag : null)
			.sourceControlMetricsCompleted(CollectionUtils.isNotEmpty(getSourceControlMetrics()) ? flag : null)
			.build();
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
