package heartbeat.util;

public interface IdUtil {

	String BOARD_REPORT_PREFIX = "board-";

	String PIPELINE_REPORT_PREFIX = "pipeline-";

	String SOURCE_CONTROL_PREFIX = "sourceControl-";

	static String getBoardReportId(String timeStamp) {
		return BOARD_REPORT_PREFIX + timeStamp;
	}

	static String getPipelineReportId(String timeStamp) {
		return PIPELINE_REPORT_PREFIX + timeStamp;
	}

	static String getSourceControlReportId(String timeStamp) {
		return SOURCE_CONTROL_PREFIX + timeStamp;
	}

}
