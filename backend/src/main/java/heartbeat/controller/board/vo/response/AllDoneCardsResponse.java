package heartbeat.controller.board.vo.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Data
@Builder
public class AllDoneCardsResponse {

	private String total;

	private DoneCard issues;

}
