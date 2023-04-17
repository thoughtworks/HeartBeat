package heartbeat.controller.board.vo.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JiraProject {

	private String id;

	private String key;

	private String name;

}
