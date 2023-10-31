package heartbeat.service.pipeline.buildkite.builder;

import heartbeat.client.dto.pipeline.buildkite.BuildKiteBuildInfo;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteJob;
import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
public class BuildKiteBuildInfoBuilder {

	private BuildKiteBuildInfo buildKiteBuildInfo;

	public static BuildKiteBuildInfoBuilder withDefault() {

		BuildKiteBuildInfo buildInfo = new BuildKiteBuildInfo();

		buildInfo.setJobs(List.of(BuildKiteJobBuilder.withDefault().build()));
		buildInfo.setCommit("xx");
		buildInfo.setNumber(1);
		buildInfo.setPipelineCreateTime("xx");
		buildInfo.setAuthor(BuildKiteBuildInfo.Author.builder().name("xx").build());
		return new BuildKiteBuildInfoBuilder(buildInfo);
	}

	public BuildKiteBuildInfo build() {
		return buildKiteBuildInfo;
	}

	public BuildKiteBuildInfoBuilder withJobs(List<BuildKiteJob> buildKiteJobs) {
		buildKiteBuildInfo.setJobs(buildKiteJobs);
		return this;
	}

	public BuildKiteBuildInfoBuilder withCommit(String commit) {
		buildKiteBuildInfo.setCommit(commit);
		return this;
	}

	public BuildKiteBuildInfoBuilder withPipelineCreateTime(String time) {
		buildKiteBuildInfo.setPipelineCreateTime(time);
		return this;
	}

}
