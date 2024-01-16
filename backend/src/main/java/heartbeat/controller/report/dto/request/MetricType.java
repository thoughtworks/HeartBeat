package heartbeat.controller.report.dto.request;

public enum MetricType {

	BOARD, DORA;

	public static MetricType fromValue(String type) {
		return switch (type) {
			case "board" -> BOARD;
			case "dora" -> DORA;
			default -> throw new IllegalArgumentException("ReportType not found!");
		};
	}

}
