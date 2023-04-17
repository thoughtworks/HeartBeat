package heartbeat.controller.board.dto.response;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TargetField implements Serializable {

	private String key;

	private String name;

	private boolean flag;

}
