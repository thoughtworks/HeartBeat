package heartbeat.controller.board.vo.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StepsDay {

	private int analyse;

	private int development;

	private int waiting;

	private int testing;

	private int blocked;

	private int review;

}
