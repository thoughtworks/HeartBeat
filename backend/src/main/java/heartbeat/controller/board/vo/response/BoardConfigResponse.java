package heartbeat.controller.board.vo.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class BoardConfigResponse {

	private List<ColumnResponse> jiraColumns;

	private List<String> users;

}
