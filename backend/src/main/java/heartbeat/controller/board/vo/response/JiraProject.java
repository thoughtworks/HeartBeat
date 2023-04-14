package heartbeat.controller.board.vo.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JiraProject {

	public String id;

	public String key;

	public String name;

}
