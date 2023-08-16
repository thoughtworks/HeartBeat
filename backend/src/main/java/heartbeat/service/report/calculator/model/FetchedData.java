package heartbeat.service.report.calculator.model;

import heartbeat.client.dto.codebase.github.PipelineLeadTime;
import heartbeat.client.dto.pipeline.buildkite.BuildKiteBuildInfo;
import heartbeat.client.dto.pipeline.buildkite.DeployTimes;
import heartbeat.controller.board.dto.response.CardCollection;
import java.util.List;
import java.util.Map;
import lombok.Builder;
import lombok.Data;

@Data
public class FetchedData {

	private CardCollectionInfo cardCollectionInfo;

	private BuildKiteData buildKiteData;

	@Data
	@Builder
	public static class CardCollectionInfo {

		private CardCollection realDoneCardCollection;

		private CardCollection nonDoneCardCollection;

	}

	@Data
	@Builder
	public static class BuildKiteData {

		private List<PipelineLeadTime> pipelineLeadTimes;

		private List<DeployTimes> deployTimesList;

		private List<Map.Entry<String, List<BuildKiteBuildInfo>>> buildInfosList;

		private List<Map.Entry<String, List<BuildKiteBuildInfo>>> leadTimeBuildInfosList;

	}

}
