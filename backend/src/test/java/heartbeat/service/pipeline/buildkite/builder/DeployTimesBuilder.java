package heartbeat.service.pipeline.buildkite.builder;

import heartbeat.client.dto.pipeline.buildkite.DeployInfo;
import heartbeat.client.dto.pipeline.buildkite.DeployTimes;
import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
public class DeployTimesBuilder {

	private DeployTimes deployTimes;

	public static DeployTimesBuilder withDefault() {

		DeployTimes deployTimes = new DeployTimes();
		deployTimes.setPipelineId("xx");
		deployTimes.setPipelineStep("xx");
		deployTimes.setPipelineName("xx");
		deployTimes.setPassed(List.of(DeployInfoBuilder.withDefault().build()));
		deployTimes.setFailed(List.of(DeployInfoBuilder.withDefault().withState("failed").build()));
		return new DeployTimesBuilder(deployTimes);
	}

	public DeployTimes build() {
		return deployTimes;
	}

	public DeployTimesBuilder withPipelineStep(String step) {
		deployTimes.setPipelineStep(step);
		return this;
	}

	public DeployTimesBuilder withPassed(List<DeployInfo> passed) {
		deployTimes.setPassed(passed);
		return this;
	}

	public DeployTimesBuilder withFailed(List<DeployInfo> failed) {
		deployTimes.setFailed(failed);
		return this;
	}

}
