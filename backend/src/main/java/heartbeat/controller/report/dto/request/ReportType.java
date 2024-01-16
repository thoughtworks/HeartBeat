package heartbeat.controller.report.dto.request;

public enum ReportType {

	METRIC("metric"), PIPELINE("pipeline"), BOARD("board");

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
