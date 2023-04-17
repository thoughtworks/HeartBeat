package heartbeat.controller.board.vo.request;

public enum CardFieldsEnum {

	STORY_POINTS_JIRA_NEXT_GEN("Story point estimate"), STORY_POINTS_JIRA_CLASSIC("Story Points"), SPRINT("Sprint"),
	FLAGGED("Flagged");

	private final String value;

	CardFieldsEnum(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}

}
