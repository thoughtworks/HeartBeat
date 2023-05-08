package heartbeat.client.dto.board.jira;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JiraCard {

	private String key;

	private JiraCardField fields;

}
