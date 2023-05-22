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

	@Nullable
	private String jobFinishTime;

	@Nullable
	private String prDelayTime;

	@Nullable
	private String pipelineDelayTime;

	@Nullable
	private String totalTime;

	public LeadTimeInfo(LeadTime leadTime) {
		if (leadTime != null) {
			// TODO LeadTime field type change from double to long
			if (leadTime.getFirstCommitTimeInPr() != 0.0) {
				this.firstCommitTimeInPr = TimeUtil
					.convertToISOFormat(String.valueOf(leadTime.getFirstCommitTimeInPr()));
			}

			if (leadTime.getPrCreatedTime() != 0.0) {
				this.prCreatedTime = TimeUtil.convertToISOFormat(String.valueOf(leadTime.getPrCreatedTime()));
			}

			if (leadTime.getPrMergedTime() != 0.0) {
				this.prMergedTime = TimeUtil.convertToISOFormat(String.valueOf(leadTime.getPrMergedTime()));
			}

			this.jobFinishTime = TimeUtil.convertToISOFormat(String.valueOf(leadTime.getJobFinishTime()));

			this.pipelineDelayTime = TimeUtil.convertMillisecondToMinutes(leadTime.getPipelineDelayTime()).toString();

			if (leadTime.getPrDelayTime() != 0.0) {
				this.prDelayTime = TimeUtil.convertMillisecondToMinutes(leadTime.getPrDelayTime()).toString();
			}

			if (leadTime.getTotalTime() != 0.0) {
				this.totalTime = TimeUtil.convertMillisecondToMinutes(leadTime.getTotalTime()).toString();
			}
		}
	}

}
