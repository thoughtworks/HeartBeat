package heartbeat.util;

public interface IdUtil {

	String BOARD_REPORT_PREFIX = "board-";

	String PIPELINE_REPORT_PREFIX = "pipeline-";

	String SOURCE_CONTROL_PREFIX = "sourceControl-";

	String DATA_COMPLETED_PREFIX = "dataCompleted-";

	static String getBoardReportFileId(String timeRangeAndTimeStamp) {
		return BOARD_REPORT_PREFIX + timeRangeAndTimeStamp;
	}

	static String getPipelineReportFileId(String timeRangeAndTimeStamp) {
		return PIPELINE_REPORT_PREFIX + timeRangeAndTimeStamp;
	}

	static String getSourceControlReportFileId(String timeRangeAndTimeStamp) {
		return SOURCE_CONTROL_PREFIX + timeRangeAndTimeStamp;
	}

	static String getDataCompletedPrefix(String timeRangeAndTimeStamp) {
		return DATA_COMPLETED_PREFIX + timeRangeAndTimeStamp;
	}

}
