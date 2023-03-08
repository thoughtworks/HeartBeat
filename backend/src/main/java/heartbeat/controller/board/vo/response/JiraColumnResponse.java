package heartbeat.controller.board.vo.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JiraColumnResponse {

	private String key;

	private ColumnValue value;

}
