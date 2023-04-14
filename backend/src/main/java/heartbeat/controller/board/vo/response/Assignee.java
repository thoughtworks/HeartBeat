package heartbeat.controller.board.vo.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Assignee {

	public String accountId;

	public String displayName;

}
