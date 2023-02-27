package heartbeat.controller.board.vo.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class Item {

	private String fieldId;

	private To to;

}
