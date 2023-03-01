package heartbeat.controller.board.vo.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TargetField implements Serializable {

	private String key;

	private String name;

	private boolean flag;

}
