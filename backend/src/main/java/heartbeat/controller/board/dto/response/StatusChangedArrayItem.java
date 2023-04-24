package heartbeat.controller.board.dto.response;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class StatusChangedArrayItem {

	private long timestamp;

	private String status;

}
