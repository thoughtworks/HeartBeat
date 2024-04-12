package heartbeat.client.dto.codebase.github;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.lang.Nullable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadTime {

	private String commitId;

	@Nullable
	private Long prCreatedTime;

	@Nullable
	private Long prMergedTime;

	@Nullable
	private Long firstCommitTimeInPr;

	private long jobFinishTime;

	private long jobStartTime;

	@Nullable
	private Long noPRCommitTime;

	@Nullable
	private Long firstCommitTime;

	private long pipelineCreateTime;

	@Nullable
	private Boolean isRevert;

	@Nullable
	private Long prLeadTime;

	private long pipelineLeadTime;

	private long totalTime;

}
