package heartbeat.client.dto.board.jira;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Data
@Builder
public class StatusSelfDTO implements Serializable {

	private String untranslatedName;

	private StatusCategory statusCategory;

}
