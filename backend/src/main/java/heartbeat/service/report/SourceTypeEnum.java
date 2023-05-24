package heartbeat.service.report;

public enum SourceTypeEnum {

	BOARD("board"), PIPELINE("pipeline");

	private final String value;

	SourceTypeEnum(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}

}
