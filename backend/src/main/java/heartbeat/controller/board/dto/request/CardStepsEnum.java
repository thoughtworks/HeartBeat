package heartbeat.controller.board.dto.request;

public enum CardStepsEnum {

	TODO("To do"), ANALYSE("Analysis"), DEVELOPMENT("In Dev"), BLOCK("Block"), TESTING("Testing"), REVIEW("Review"),
	DONE("Done"), CLOSED("Closed"), WAITING("Waiting for testing"), FLAG("FLAG"), REMOVEFLAG("removeFlag"),
	UNKNOWN("UNKNOWN");

	private final String value;

	CardStepsEnum(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}

	public static CardStepsEnum fromValue(String type) {
		for (CardStepsEnum cardStepsEnum : values()) {
			if (cardStepsEnum.value.equals(type)) {
				return cardStepsEnum;
			}
		}
		throw new IllegalArgumentException("Type does not find!");
	}

}
