package heartbeat.enums;

public enum SprintState {

	ACTIVE("active"), CLOSED("closed"), FUTURE("future");

	private final String value;

	SprintState(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}

}
