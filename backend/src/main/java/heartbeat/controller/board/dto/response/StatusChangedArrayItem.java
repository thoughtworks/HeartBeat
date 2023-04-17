package heartbeat.controller.board.dto.response;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class StatusChangedArrayItem {

	private int timestamp;

	private String status;

}
