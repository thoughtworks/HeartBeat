package heartbeat.controller.board;

import heartbeat.controller.board.vo.response.BoardConfigResponse;
import heartbeat.controller.board.vo.response.ColumnValue;
import heartbeat.controller.board.vo.response.JiraColumnResponse;
import heartbeat.controller.board.vo.response.TargetField;
import java.util.List;

public class BoardConfigResponseFixture {

    public static BoardConfigResponse.BoardConfigResponseBuilder BOARD_CONFIG_RESPONSE_BUILDER() {
        return BoardConfigResponse.builder()
                .jiraColumnResponses(
                        List.of(JiraColumnResponse.builder().value(ColumnValue.builder().name("TODO").build()).build()))
                .users(List.of("Zhang San"))
                .targetFields(List.of(new TargetField("priority", "Priority", false),
                        new TargetField("timetracking", "Time tracking", false)));
    }

}
