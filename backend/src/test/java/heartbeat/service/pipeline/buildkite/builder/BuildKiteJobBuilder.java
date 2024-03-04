package heartbeat.service.pipeline.buildkite.builder;

import heartbeat.client.dto.pipeline.buildkite.BuildKiteJob;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class BuildKiteJobBuilder {

	private BuildKiteJob buildKiteJob;

	public static BuildKiteJobBuilder withDefault() {

		BuildKiteJob buildKiteJob = new BuildKiteJob();

		buildKiteJob.setStartedAt("2022-09-09T04:56:44.162Z");
		buildKiteJob.setName("xx");
		buildKiteJob.setState("failed");
		buildKiteJob.setFinishedAt("2022-09-09T04:57:09.545Z");
		return new BuildKiteJobBuilder(buildKiteJob);
	}

	public BuildKiteJob build() {
		return buildKiteJob;
	}

	public BuildKiteJobBuilder withState(String state) {
		buildKiteJob.setState(state);
		return this;
	}

	public BuildKiteJobBuilder withStartedAt(String startedAt) {
		buildKiteJob.setStartedAt(startedAt);
		return this;
	}

	public BuildKiteJobBuilder withFinishedAt(String finishedAt) {
		buildKiteJob.setFinishedAt(finishedAt);
		return this;
	}

	public BuildKiteJobBuilder withName(String name) {
		buildKiteJob.setName(name);
		return this;
	}

}
