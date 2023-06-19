package heartbeat.client.dto.board.jira;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class StatusCategory implements Serializable {

	private String key;

	private String name;

}
