package heartbeat.controller.report.dto.response;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class AvgLeadTimeForChanges {
	private String name = "Average";
	private Number mergeDelayTime;
	private Number pipelineDelayTime;
	private Number totalDelayTime;

	public AvgLeadTimeForChanges(Number mergeDelayTime, Number pipelineDelayTime) {
		this.mergeDelayTime = Math.round((mergeDelayTime.doubleValue() / 1000 / 60) * 100.0) / 100.0;
		this.pipelineDelayTime = Math.round((pipelineDelayTime.doubleValue() / 1000 / 60) * 100.0) / 100.0;
		this.totalDelayTime = this.mergeDelayTime.doubleValue() + this.pipelineDelayTime.doubleValue();
	}
}
