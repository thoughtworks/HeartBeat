package heartbeat.controller.board.dto.request;

public enum CardStepsEnum {

	TODO("To do"), ANALYSE("Analysis"), DEVELOPMENT("In Dev"), BLOCK("Block"), TESTING("Testing"), REVIEW("Review"),
	DONE("Done"), WAITING("Waiting for testing"), FLAG("FLAG"), REMOVEFLAG("removeFlag"), UNKNOWN("UNKNOWN");

	private final String value;

	private CardStepsEnum(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}

	public static CardStepsEnum fromValue(String type) {
		return switch (type) {
			case "In Dev" -> DEVELOPMENT;
			case "Waiting for testing" -> WAITING;
			case "Block" -> BLOCK;
			case "Testing" -> TESTING;
			case "Review" -> REVIEW;
			case "UNKNOWN" -> UNKNOWN;
			case "FLAG" -> FLAG;
			default -> throw new IllegalArgumentException("Type does not find!");
		};
	}

}
