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

	private String jobStartTime;

	private String noPRCommitTime;

	private String firstCommitTime;

	@Nullable
	private String prLeadTime;

	private String pipelineLeadTime;

	@Nullable
	private String totalTime;

	private Boolean isRevert;

	public LeadTimeInfo(LeadTime leadTime) {
		if (leadTime == null) {
			return;
		}
		this.firstCommitTimeInPr = convertToISOFormat(leadTime.getFirstCommitTimeInPr());
		this.prCreatedTime = convertToISOFormat(leadTime.getPrCreatedTime());
		this.prMergedTime = convertToISOFormat(leadTime.getPrMergedTime());
		this.jobFinishTime = convertToISOFormat(leadTime.getJobFinishTime());
		this.jobStartTime = convertToISOFormat(leadTime.getJobStartTime());
		this.firstCommitTime = convertToISOFormat(leadTime.getFirstCommitTime());
		this.noPRCommitTime = convertToISOFormat(leadTime.getNoPRCommitTime());

		this.pipelineLeadTime = TimeUtil.msToHMS(leadTime.getPipelineLeadTime());
		this.isRevert = leadTime.getIsRevert();

		if (leadTime.getPrLeadTime() != null) {
			this.prLeadTime = TimeUtil.msToHMS(leadTime.getPrLeadTime());
		}

		if (leadTime.getTotalTime() != 0) {
			this.totalTime = TimeUtil.msToHMS(leadTime.getTotalTime());
		}
	}

	private String convertToISOFormat(Long time) {
		return time != null ? TimeUtil.convertToISOFormat(String.valueOf(time)) : null;
	}

}
