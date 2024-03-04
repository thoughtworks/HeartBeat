package heartbeat.util;

public interface IdUtil {

	String BOARD_REPORT_PREFIX = "board-";

	String DORA_REPORT_PREFIX = "dora-";

	String PIPELINE_REPORT_PREFIX = "pipeline-";

	String SOURCE_CONTROL_PREFIX = "sourceControl-";

	static String getBoardReportId(String timeStamp) {
		return BOARD_REPORT_PREFIX + timeStamp;
	}

	static String getDoraReportId(String timeStamp) {
		return DORA_REPORT_PREFIX + timeStamp;
	}

	static String getPipelineReportId(String timeStamp) {
		return PIPELINE_REPORT_PREFIX + timeStamp;
	}

	static String getSourceControlReportId(String timeStamp) {
		return SOURCE_CONTROL_PREFIX + timeStamp;
	}

}
