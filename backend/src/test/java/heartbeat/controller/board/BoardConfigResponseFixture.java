package heartbeat.controller.board;

import heartbeat.controller.board.vo.response.BoardConfigResponse;
import heartbeat.controller.board.vo.response.JiraColumnResponse;
import heartbeat.controller.board.vo.response.ColumnValue;

import java.util.List;

public class BoardConfigResponseFixture {

	public static BoardConfigResponse.BoardConfigResponseBuilder BOARD_CONFIG_RESPONSE_BUILDER() {
		return BoardConfigResponse.builder().jiraColumnResponses(
				List.of(JiraColumnResponse.builder().value(ColumnValue.builder().name("TODO").build()).build()));
	}

}
