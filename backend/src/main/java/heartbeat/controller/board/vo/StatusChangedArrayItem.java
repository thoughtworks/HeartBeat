package heartbeat.controller.board.vo;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class StatusChangedArrayItem {

	private long timestamp;

	private String status;

}
