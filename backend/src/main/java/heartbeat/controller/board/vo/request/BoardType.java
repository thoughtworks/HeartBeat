package heartbeat.controller.board.vo.request;

public enum BoardType {

	JIRA("jira");

	public final String boardType;

	BoardType(String boardType) {
		this.boardType = boardType;
	}

}
