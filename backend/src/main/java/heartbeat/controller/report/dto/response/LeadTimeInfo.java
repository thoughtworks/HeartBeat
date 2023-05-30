package heartbeat.controller.report.dto.response;

import heartbeat.client.dto.codebase.github.LeadTime;
import heartbeat.util.TimeUtil;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.lang.Nullable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadTimeInfo {

	@Nullable
	private String prCreatedTime;

	@Nullable
	private String prMergedTime;

	@Nullable
	private String firstCommitTimeInPr;

	private String jobFinishTime;

	@Nullable
	private String prDelayTime;

	private String pipelineDelayTime;

	@Nullable
	private String totalTime;

	public LeadTimeInfo(LeadTime leadTime) {
		if (leadTime != null) {
			if (leadTime.getFirstCommitTimeInPr() != 0) {
				this.firstCommitTimeInPr = TimeUtil
					.convertToISOFormat(String.valueOf(leadTime.getFirstCommitTimeInPr()));
			}

			if (leadTime.getPrCreatedTime() != 0) {
				this.prCreatedTime = TimeUtil.convertToISOFormat(String.valueOf(leadTime.getPrCreatedTime()));
			}

			if (leadTime.getPrMergedTime() != 0) {
				this.prMergedTime = TimeUtil.convertToISOFormat(String.valueOf(leadTime.getPrMergedTime()));
			}

			this.jobFinishTime = TimeUtil.convertToISOFormat(String.valueOf(leadTime.getJobFinishTime()));

			this.pipelineDelayTime = TimeUtil.msToHMS(leadTime.getPipelineDelayTime()).toString();

			if (leadTime.getPrDelayTime() != 0.0) {
				this.prDelayTime = TimeUtil.msToHMS(leadTime.getPrDelayTime()).toString();
			}

			if (leadTime.getTotalTime() != 0.0) {
				this.totalTime = TimeUtil.msToHMS(leadTime.getTotalTime()).toString();
			}
		}
	}

}
