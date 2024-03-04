package heartbeat.controller.board;

import heartbeat.controller.board.dto.response.BoardConfigDTO;
import heartbeat.controller.board.dto.response.ColumnValue;
import heartbeat.controller.board.dto.response.JiraColumnDTO;
import heartbeat.controller.board.dto.response.TargetField;
import java.util.List;

public class BoardConfigResponseFixture {

	public static BoardConfigDTO.BoardConfigDTOBuilder BOARD_CONFIG_RESPONSE_BUILDER() {
		return BoardConfigDTO.builder()
			.jiraColumnResponse(
					List.of(JiraColumnDTO.builder().value(ColumnValue.builder().name("TODO").build()).build()))
			.users(List.of("Zhang San"))
			.targetFields(List.of(new TargetField("priority", "Priority", false),
					new TargetField("timetracking", "Time tracking", false)));
	}

}
