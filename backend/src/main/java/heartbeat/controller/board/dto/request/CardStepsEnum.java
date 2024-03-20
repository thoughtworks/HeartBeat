package heartbeat.controller.board.dto.request;

import java.util.Map;
import java.util.Set;

public enum CardStepsEnum {

	ANALYSE("Analysis", "Analysis"), TODO("To do", "To do"), DEVELOPMENT("In Dev", "In dev"), BLOCK("Block", "Block"),
	FLAG("FLAG", "Flag"), REMOVEFLAG("removeFlag", "Remove flag"), REVIEW("Review", "Review"),
	WAITING("Waiting for testing", "Waiting for testing"), TESTING("Testing", "Testing"), DONE("Done", "Done"),
	CLOSED("Closed", "Closed"), UNKNOWN("UNKNOWN", "Unknown");

	private final String value;

	private final String alias;

	CardStepsEnum(String value, String alias) {
		this.value = value;
		this.alias = alias;
	}

	public String getValue() {
		return value;
	}

	public String getAlias() {
		return alias;
	}

	public static CardStepsEnum fromValue(String type) {
		for (CardStepsEnum cardStepsEnum : values()) {
			if (cardStepsEnum.value.equals(type)) {
				return cardStepsEnum;
			}
		}
		throw new IllegalArgumentException("Type does not find!");
	}

	public static final Map<CardStepsEnum, Set<CardStepsEnum>> reworkJudgmentMap = Map.of(TODO,
			Set.of(ANALYSE, DEVELOPMENT, BLOCK, REVIEW, WAITING, TESTING, DONE), ANALYSE,
			Set.of(DEVELOPMENT, BLOCK, REVIEW, WAITING, TESTING, DONE), DEVELOPMENT,
			Set.of(BLOCK, REVIEW, WAITING, TESTING, DONE), BLOCK, Set.of(REVIEW, WAITING, TESTING, DONE), REVIEW,
			Set.of(WAITING, TESTING, DONE), WAITING, Set.of(TESTING, DONE), TESTING, Set.of(DONE));

}
