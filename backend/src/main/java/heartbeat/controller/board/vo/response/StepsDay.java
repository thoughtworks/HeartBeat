package heartbeat.controller.board.vo.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StepsDay {

	private double analyse;

	private double development;

	private double waiting;

	private double testing;

	private double blocked;

	private double review;

}
