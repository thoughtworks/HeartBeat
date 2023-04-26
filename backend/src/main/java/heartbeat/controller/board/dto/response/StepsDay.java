package heartbeat.controller.board.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StepsDay {

	private double analyse;

	private double development;

	private double waiting;

	private double testing;

	private double blocked;

	private double review;

}
