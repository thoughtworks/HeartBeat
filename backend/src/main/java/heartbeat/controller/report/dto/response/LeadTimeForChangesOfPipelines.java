package heartbeat.controller.report.dto.response;

public class LeadTimeForChangesOfPipelines {
	private String name;
	private String step;
	private Number mergeDelayTime;
	private Number pipelineDelayTime;
	private Number totalDelayTime;

	public LeadTimeForChangesOfPipelines(String name, String step, Number mergeDelayTime, Number pipelineDelayTime, Number totalDelayTime) {
		this.name = name;
		this.step = step;
		this.mergeDelayTime = mergeDelayTime;
		this.pipelineDelayTime = pipelineDelayTime;
		this.totalDelayTime = totalDelayTime;
	}
}
