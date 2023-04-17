package heartbeat.controller.board.vo.response;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class TargetField implements Serializable {

	private String key;

	private String name;

	private boolean flag;

}
