package heartbeat.controller.board.vo.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CardCycleTime {

	private String name;

	private StepsDay steps;

	private int total;

}

@Data
@Builder
class StepsDay {

	private int analyse;

	private int development;

	private int waiting;

	private int testing;

	private int blocked;

	private int review;

}
