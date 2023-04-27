package heartbeat.controller.report.dto.response;

public class LeadTimeForChangesOfPipelines {
	private String name;
	private String step;
	private Double mergeDelayTime;
	private Double pipelineDelayTime;
	private Double totalDelayTime;

	public LeadTimeForChangesOfPipelines(String name, String step, Double mergeDelayTime, Double pipelineDelayTime) {
		//TODO: add logic of calculation
		this.name = name;
		this.step = step;
		this.mergeDelayTime = Math.round((mergeDelayTime/ 1000 / 60) * 100.0) / 100.0;
		this.pipelineDelayTime = Math.round((pipelineDelayTime/ 1000 / 60) * 100.0) / 100.0;
		this.totalDelayTime = this.mergeDelayTime + this.pipelineDelayTime;
	}
}
