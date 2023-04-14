package heartbeat.controller.board.vo.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class JiraCards {

	public Integer total;

	public List<JiraCard> issues;

}
