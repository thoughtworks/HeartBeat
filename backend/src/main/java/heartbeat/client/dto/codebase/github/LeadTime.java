package heartbeat.client.dto.codebase.github;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadTime {

	private String commitId;

	private long prCreatedTime;

	private long prMergedTime;

	private long firstCommitTimeInPr;

	private long jobFinishTime;

	private long pipelineCreateTime;

	private double prDelayTime;

	private double pipelineDelayTime;

	private double totalTime;

}
