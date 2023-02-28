package heartbeat.controller.board.vo.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
@AllArgsConstructor
public class Item implements Serializable {

	private String fieldId;

	private To to;

}
