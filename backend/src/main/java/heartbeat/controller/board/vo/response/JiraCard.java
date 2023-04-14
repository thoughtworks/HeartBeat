package heartbeat.controller.board.vo.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JiraCard {

	private String key;

	private JiraCardField fields;

}
