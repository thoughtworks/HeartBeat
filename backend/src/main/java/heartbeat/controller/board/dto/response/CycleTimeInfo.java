package heartbeat.controller.board.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CycleTimeInfo {

	private String column;

	private Double day;

}
