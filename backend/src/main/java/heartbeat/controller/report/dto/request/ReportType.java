package heartbeat.controller.report.dto.request;

public enum ReportType {

	BOARD("board"), DORA("dora");

	public final String reportType;

	ReportType(String reportType) {
		this.reportType = reportType;
	}

	public static ReportType fromValue(String type) {
		return switch (type) {
			case "board" -> BOARD;
			case "dora" -> DORA;
			default -> throw new IllegalArgumentException("ReportType not found!");
		};
	}

}
