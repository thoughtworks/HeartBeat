package heartbeat.controller.board.vo.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class BoardConfigResponse {

	private String id;

	private String name;

	private List<ColumnResponse> jiraColumns;

}
