package heartbeat.controller.board;

import heartbeat.controller.board.vo.response.BoardConfigResponse;

public class BoardConfigResponseFixture {

	public static final String BOARD_ID = "123";

	public static final String JIRA_BOARD = "jira";

	public static BoardConfigResponse.BoardConfigResponseBuilder BOARD_CONFIG_RESPONSE_BUILDER() {
		return BoardConfigResponse.builder().name(JIRA_BOARD).id(BOARD_ID);
	}

}
