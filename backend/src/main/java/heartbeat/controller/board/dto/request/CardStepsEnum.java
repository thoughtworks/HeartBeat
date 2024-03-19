package heartbeat.controller.board.dto.request;

import java.util.Map;
import java.util.Set;

public enum CardStepsEnum {

	ANALYSE("Analysis"), TODO("To do"), DEVELOPMENT("In Dev"), BLOCK("Block"), FLAG("FLAG"), REMOVEFLAG("removeFlag"),
	REVIEW("Review"), WAITING("Waiting for testing"), TESTING("Testing"), DONE("Done"), CLOSED("Closed"),
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

	public static final Map<CardStepsEnum, Set<CardStepsEnum>> reworkJudgmentMap = Map.of(ANALYSE,
			Set.of(TODO, DEVELOPMENT, BLOCK, REVIEW, WAITING, TESTING, DONE), TODO,
			Set.of(DEVELOPMENT, BLOCK, REVIEW, WAITING, TESTING, DONE), DEVELOPMENT,
			Set.of(BLOCK, REVIEW, WAITING, TESTING, DONE), BLOCK, Set.of(REVIEW, WAITING, TESTING, DONE), REVIEW,
			Set.of(WAITING, TESTING, DONE), WAITING, Set.of(TESTING, DONE), TESTING, Set.of(DONE));

}
