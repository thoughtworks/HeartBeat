package heartbeat.controller.report.dto.response;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class AvgLeadTimeForChanges {
	private String name = "Average";
	private Double mergeDelayTime;
	private Double pipelineDelayTime;
	private Double totalDelayTime;

	public AvgLeadTimeForChanges(Double mergeDelayTime, Double pipelineDelayTime) {
		this.mergeDelayTime = Math.round((mergeDelayTime/ 1000 / 60) * 100.0) / 100.0;
		this.pipelineDelayTime = Math.round((pipelineDelayTime/ 1000 / 60) * 100.0) / 100.0;
		this.totalDelayTime = this.mergeDelayTime + this.pipelineDelayTime;
	}
}
