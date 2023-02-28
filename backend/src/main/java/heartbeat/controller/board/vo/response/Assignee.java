package heartbeat.controller.board.vo.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class Assignee implements Serializable {

	private String displayName;

}
