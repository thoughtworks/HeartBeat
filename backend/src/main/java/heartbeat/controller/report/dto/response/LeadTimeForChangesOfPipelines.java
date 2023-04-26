package heartbeat.controller.report.dto.response;

public class LeadTimeForChangesOfPipelines {
	private String name;
	private String step;
	private Double mergeDelayTime;
	private Double pipelineDelayTime;
	private Double totalDelayTime;

	public LeadTimeForChangesOfPipelines(String name, String step, Double mergeDelayTime, Double pipelineDelayTime, Double totalDelayTime) {
		this.name = name;
		this.step = step;
		this.mergeDelayTime = mergeDelayTime;
		this.pipelineDelayTime = pipelineDelayTime;
		this.totalDelayTime = totalDelayTime;
	}
}
