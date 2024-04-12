package heartbeat.controller.report.dto.request;

public enum MetricEnum {

	VELOCITY("velocity"), CYCLE_TIME("cycle time"), CLASSIFICATION("classification"),
	DEPLOYMENT_FREQUENCY("deployment frequency"), DEV_CHANGE_FAILURE_RATE("dev change failure rate"),
	DEV_MEAN_TIME_TO_RECOVERY("dev mean time to recovery"), LEAD_TIME_FOR_CHANGES("lead time for changes"),
	REWORK_TIMES("rework times");

	private final String value;

	MetricEnum(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}

}
