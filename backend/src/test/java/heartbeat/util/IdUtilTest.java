package heartbeat.util;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class IdUtilTest {

	@Test
	void shouldReturnBoardReportId() {
		String timeStamp = "121322545121";
		String expected = "board-121322545121";

		String boardReportId = IdUtil.getBoardReportId(timeStamp);

		Assertions.assertEquals(expected, boardReportId);
	}

	@Test
	void shouldReturnPipelineReportId() {
		String timeStamp = "121322545121";
		String expected = "pipeline-121322545121";

		String pipelineReportId = IdUtil.getPipelineReportId(timeStamp);

		Assertions.assertEquals(expected, pipelineReportId);
	}

	@Test
	void shouldReturnSourceControlReportId() {
		String timeStamp = "121322545121";
		String expected = "sourceControl-121322545121";

		String sourceControlReportId = IdUtil.getSourceControlReportId(timeStamp);

		Assertions.assertEquals(expected, sourceControlReportId);
	}

}
