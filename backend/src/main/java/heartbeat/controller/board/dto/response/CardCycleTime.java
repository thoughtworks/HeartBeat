package heartbeat.controller.board.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CardCycleTime {

	private String name;

	private StepsDay steps;

	private int total;

}
