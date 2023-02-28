package heartbeat.controller.board.vo.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class Fields implements Serializable {

	private Assignee assignee;

}
