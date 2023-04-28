package heartbeat.controller.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvgLeadTimeForChanges {

	private String name = "Average";

	private Double mergeDelayTime;

	private Double pipelineDelayTime;

	private Double totalDelayTime;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public AvgLeadTimeForChanges(Double mergeDelayTime, Double pipelineDelayTime) {
		setDelayTime(mergeDelayTime, pipelineDelayTime);
	}

	public void setDelayTime(Double mergeDelayTime, Double pipelineDelayTime) {
		this.mergeDelayTime = Math.round((mergeDelayTime / 1000 / 60) * 100.0) / 100.0;
		this.pipelineDelayTime = Math.round((pipelineDelayTime / 1000 / 60) * 100.0) / 100.0;
		this.totalDelayTime = this.mergeDelayTime + this.pipelineDelayTime;
	}

}
