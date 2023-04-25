package heartbeat.client.dto.codebase.github;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadTime {

	private String commitId;

	private Number prCreatedTime;

	private Number prMergedTime;

	private Number firstCommitTimeInPr;

	private Number jobFinishTime;

	private Number pipelineCreateTime;

	private Number prDelayTime;

	private Number pipelineDelayTime;

	private Number totalTime;

}
