package heartbeat.config;

public enum DataType {

	METRIC, BOARD, PIPELINE;

	public static DataType fromValue(String type) {
		return switch (type) {
			case "metric" -> METRIC;
			case "board" -> BOARD;
			case "pipeline" -> PIPELINE;
			default -> throw new IllegalArgumentException("Data type does not find!");
		};
	}

}
