package heartbeat.client.dto.codebase.github;

public class LeadTimeDelayTime {

	private Double prDelayTime;

	private Double pipelineDelayTime;

	public LeadTimeDelayTime(Double prDelayTime, Double pipelineDelayTime) {
		this.prDelayTime = prDelayTime;
		this.pipelineDelayTime = pipelineDelayTime;
	}

	public Number getPrDelayTime() {
		return prDelayTime;
	}

	public Number getPipelineDelayTime() {
		return pipelineDelayTime;
	}

}
