package heartbeat.controller.board;

import heartbeat.controller.board.vo.request.BoardRequest;

public class BoardRequestFixture {

	public static String BOARD_NAME = "jira";

	public static String BOARD_ID = "123";

	public static BoardRequest.BoardRequestBuilder BOARD_REQUEST_BUILDER() {
		return BoardRequest.builder().boardName(BOARD_NAME).boardId(BOARD_ID).email("test@email.com")
				.projectKey("project key").site("site").token("token");
	}

}
