package heartbeat.controller.board;

import heartbeat.controller.board.dto.request.BoardRequestParam;

import static heartbeat.service.jira.JiraBoardConfigDTOFixture.BOARD_ID;

public class BoardRequestFixture {

	public static final String BOARD_ID = "unknown";

	public static BoardRequestParam.BoardRequestParamBuilder BOARD_REQUEST_BUILDER() {
		return BoardRequestParam.builder()
			.boardId(BOARD_ID)
			.projectKey("project key")
			.site("site")
			.token("token")
			.startTime("1672556350000")
			.endTime("1676908799000");
	}

}
