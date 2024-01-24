package heartbeat.controller.report.dto.request;

/**
 * this is an indicator for Report Data
 */
public enum ReportDataType {

	METRIC("metric"), // All metric calculated data
	PIPELINE("pipeline"), // All raw data only for Pipeline
	BOARD("board"); // All raw data only for Board

	private String value;

	ReportDataType(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}

	public static ReportDataType fromValue(String type) {
		return switch (type) {
			case "metric" -> METRIC;
			case "pipeline" -> PIPELINE;
			case "board" -> BOARD;
			default -> throw new IllegalArgumentException("ReportType not found!");
		};
	}

}
