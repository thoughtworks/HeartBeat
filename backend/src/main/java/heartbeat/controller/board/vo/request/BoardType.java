package heartbeat.controller.board.vo.request;

public enum BoardType {

	JIRA("jira"), CLASSIC_JIRA("classic_jira");

	public final String boardType;

	BoardType(String boardType) {
		this.boardType = boardType;
	}

}
