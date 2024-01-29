package heartbeat.service.report;

public enum CSVFileNameEnum {

	METRIC("./app/output/csv/metric"), BOARD("./app/output/csv/board"), PIPELINE("./app/output/csv/pipeline");

	private final String value;

	CSVFileNameEnum(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}

}
