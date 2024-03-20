package heartbeat.controller.board.dto.request;

import java.util.Map;
import java.util.Set;

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

	public static final Map<CardStepsEnum, Set<CardStepsEnum>> reworkJudgmentMap = Map.of(TODO,
			Set.of(ANALYSE, DEVELOPMENT, BLOCK, REVIEW, WAITING, TESTING, DONE), ANALYSE,
			Set.of(DEVELOPMENT, BLOCK, REVIEW, WAITING, TESTING, DONE), DEVELOPMENT,
			Set.of(BLOCK, REVIEW, WAITING, TESTING, DONE), BLOCK, Set.of(REVIEW, WAITING, TESTING, DONE), REVIEW,
			Set.of(WAITING, TESTING, DONE), WAITING, Set.of(TESTING, DONE), TESTING, Set.of(DONE));

}
