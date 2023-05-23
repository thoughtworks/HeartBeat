package heartbeat.service.report;

public enum CSVFileNameEnum {

	BOARD("./csv/exportOriginMetrics"), PIPELINE("./csv/exportPipelineMetrics");

	private final String value;

	CSVFileNameEnum(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}

}
