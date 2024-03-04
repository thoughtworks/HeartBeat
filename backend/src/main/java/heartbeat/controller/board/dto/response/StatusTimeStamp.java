package heartbeat.controller.board.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatusTimeStamp {

	private long startTimestamp;

	private long endTimestamp;

	private String status;

}
