package heartbeat.controller.report.dto.request;

public enum ReportType {

	BOARD, DORA;

	public static ReportType fromValue(String type) {
		return switch (type) {
			case "board" -> BOARD;
			case "dora" -> DORA;
			default -> throw new IllegalArgumentException("ReportType not found!");
		};
	}

}
