package heartbeat.client.dto.board.jira;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Assignee implements Serializable {

	private String displayName;

}