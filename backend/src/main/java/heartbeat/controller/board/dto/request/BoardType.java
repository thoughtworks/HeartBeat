package heartbeat.controller.board.dto.request;

public enum BoardType {

	JIRA("jira"), CLASSIC_JIRA("classic-jira"), LINEAR("linear");

	public final String boardType;

	BoardType(String boardType) {
		this.boardType = boardType;
	}

	public static BoardType fromValue(String type) {
		return switch (type) {
			case "jira" -> JIRA;
			case "classic-jira" -> CLASSIC_JIRA;
			case "linear" -> LINEAR;
			default -> throw new IllegalArgumentException("Board type does not find!");
		};
	}

}
