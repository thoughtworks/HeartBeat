package heartbeat.util;

public interface ReportIdUtil {

	static final String BOARD_REPORT_PREFIX = "board-";

	static String getBoardReportId(String timeStamp) {
		return BOARD_REPORT_PREFIX + timeStamp;
	}

}
