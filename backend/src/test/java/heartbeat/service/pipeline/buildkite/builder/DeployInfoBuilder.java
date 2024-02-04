package heartbeat.service.pipeline.buildkite.builder;

import heartbeat.client.dto.pipeline.buildkite.DeployInfo;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class DeployInfoBuilder {

	private DeployInfo deployInfo;

	public static DeployInfoBuilder withDefault() {

		DeployInfo deployInfo = new DeployInfo();

		deployInfo.setPipelineCreateTime("xx");
		deployInfo.setJobStartTime("2022-09-09T04:56:44.162Z");
		deployInfo.setJobFinishTime("2022-09-09T04:57:09.545Z");
		deployInfo.setCommitId("xx");
		deployInfo.setState("passed");
		deployInfo.setJobName("xx");
		deployInfo.setPipelineCanceled(false);
		return new DeployInfoBuilder(deployInfo);
	}

	public DeployInfo build() {
		return deployInfo;
	}

	public DeployInfoBuilder withState(String state) {
		deployInfo.setState(state);
		return this;
	}

	public DeployInfoBuilder withJobFinishTime(String jobFinishTime) {
		deployInfo.setJobFinishTime(jobFinishTime);
		return this;
	}

	public DeployInfoBuilder withJobName(String jobName) {
		deployInfo.setJobName(jobName);
		return this;
	}

}
