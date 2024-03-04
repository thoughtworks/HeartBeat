package heartbeat.controller.report.dto.request;

public enum ReportType {

	METRIC("metric"), // All metric calculated data
	PIPELINE("pipeline"), // All raw data only for Pipeline
	BOARD("board"); // All raw data only for Board

	private String value;

	ReportType(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}

	public static ReportType fromValue(String type) {
		return switch (type) {
			case "metric" -> METRIC;
			case "pipeline" -> PIPELINE;
			case "board" -> BOARD;
			default -> throw new IllegalArgumentException("ReportType not found!");
		};
	}

}
