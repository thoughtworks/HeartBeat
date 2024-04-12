package heartbeat.controller.report.dto.response;

import heartbeat.client.dto.codebase.github.LeadTime;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class LeadTimeInfoTest {

	@Test
	void shouldCreateLeadTimeInfoWithLeadTime() {
		LeadTimeInfo info = new LeadTimeInfo(LeadTime.builder()
			.prLeadTime(47255635L)
			.firstCommitTimeInPr(1672556350000L)
			.prCreatedTime(1706067997L)
			.prMergedTime(1706067997L)
			.firstCommitTime(1706067997L)
			.noPRCommitTime(1706067997L)
			.totalTime(57255635L)
			.isRevert(Boolean.FALSE)
			.build());

		assertEquals("13:7:35", info.getPrLeadTime());
		assertEquals("2023-01-01T06:59:10Z", info.getFirstCommitTimeInPr());
		assertEquals("1970-01-20T17:54:27Z", info.getPrMergedTime());
		assertEquals("1970-01-20T17:54:27Z", info.getPrCreatedTime());
		assertEquals("1970-01-20T17:54:27Z", info.getFirstCommitTime());
		assertEquals("1970-01-20T17:54:27Z", info.getNoPRCommitTime());
		assertEquals("15:54:15", info.getTotalTime());
		assertEquals(Boolean.FALSE, info.getIsRevert());
	}

}
