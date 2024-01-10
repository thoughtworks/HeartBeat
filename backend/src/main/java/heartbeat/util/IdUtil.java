package heartbeat.util;

public interface IdUtil {

	String BOARD_REPORT_PREFIX = "board-";

	String PIPELINE_REPORT_PREFIX = "pipeline-";

	String CODE_BASE_PREFIX = "github-";

	static String getBoardReportId(String timeStamp) {
		return BOARD_REPORT_PREFIX + timeStamp;
	}

	static String getPipelineReportId(String timeStamp) {
		return PIPELINE_REPORT_PREFIX + timeStamp;
	}

	static String getCodeBaseReportId(String timeStamp) {
		return CODE_BASE_PREFIX + timeStamp;
	}

	static String getTimeStampFromReportId(String reportId) {
		String[] splitResult = reportId.split("\\s*\\-|\\.\\s*");
		return splitResult[1];
	}

}
