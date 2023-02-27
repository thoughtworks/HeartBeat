package heartbeat.controller.board;

import heartbeat.controller.board.vo.request.BoardRequest;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import static heartbeat.service.jira.JiraBoardConfigDTOFixture.BOARD_ID;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.BOARD_NAME;

public class BoardRequestFixture {

	public static BoardRequest.BoardRequestBuilder BOARD_REQUEST_BUILDER() {
		return BoardRequest.builder()
			.boardName(BOARD_NAME)
			.boardId(BOARD_ID)
			.email("test@email.com")
			.projectKey("project key")
			.site("site")
			.token("token")
			.startTime(OffsetDateTime.of(LocalDateTime.of(2023, 1, 1, 1, 1), ZoneOffset.UTC))
			.endTime(OffsetDateTime.of(LocalDateTime.of(2023, 2, 1, 1, 1), ZoneOffset.UTC));
	}

}
