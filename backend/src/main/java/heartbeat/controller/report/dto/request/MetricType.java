package heartbeat.controller.report.dto.request;

public enum MetricType {

	BOARD("board"), DORA("dora");

	public final String metricType;

	MetricType(String metricType) {
		this.metricType = metricType;
	}

	public static MetricType fromValue(String type) {
		return switch (type) {
			case "board" -> BOARD;
			case "dora" -> DORA;
			default -> throw new IllegalArgumentException("MetricType not found!");
		};
	}

}
