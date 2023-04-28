package heartbeat.controller.report.dto.request;

public enum RequireDataEnum {

	VELOCITY("velocity"), CYCLE_TIME("cycle time"), CLASSIFICATION("classification"),
	DEPLOYMENT_FREQUENCY("deployment frequency"), CHANGE_FAILURE_RATE("change failure rate"),
	MEAN_TIME_TO_RECOVERY("mean time to recovery"), LEAD_TIME_FOR_CHANGES("lead time for changes");

	private final String value;

	RequireDataEnum(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}

}
