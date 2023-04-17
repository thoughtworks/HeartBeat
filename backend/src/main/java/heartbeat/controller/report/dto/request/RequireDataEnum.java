package heartbeat.controller.report.dto.request;

public enum RequireDataEnum {

	VELOCITY("velocity"), CYCLE_TIME("cycle time"), CLASSIFICATION("classification");

	private final String value;

	RequireDataEnum(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}

}
