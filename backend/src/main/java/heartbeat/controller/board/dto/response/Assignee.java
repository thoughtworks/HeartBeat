package heartbeat.controller.board.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Assignee {

	private String accountId;

	private String displayName;

}
