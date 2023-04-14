package heartbeat.controller.board.vo;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class StatusChangedArrayItem {

	private int timestamp;

	private String status;

}
