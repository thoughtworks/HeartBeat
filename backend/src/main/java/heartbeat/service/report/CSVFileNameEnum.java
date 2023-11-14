package heartbeat.service.report;

public enum CSVFileNameEnum {

	METRIC("./csv/metric"), BOARD("./csv/board"), PIPELINE("./csv/pipeline");

	private final String value;

	CSVFileNameEnum(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}

}
