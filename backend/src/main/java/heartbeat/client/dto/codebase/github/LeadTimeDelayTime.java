package heartbeat.client.dto.codebase.github;

public class LeadTimeDelayTime {
	private Number prDelayTime;

	private Number pipelineDelayTime;

	public LeadTimeDelayTime(Number prDelayTime, Number pipelineDelayTime) {
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
