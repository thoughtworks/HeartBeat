package heartbeat.controller.board.vo.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@AllArgsConstructor
@Data
public class StatusCategory implements Serializable {

	private String key;

	private String name;

}
