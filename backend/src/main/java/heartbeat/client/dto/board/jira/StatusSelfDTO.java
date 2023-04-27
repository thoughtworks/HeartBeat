package heartbeat.client.dto.board.jira;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Data
@Builder
public class StatusSelfDTO {

	private String untranslatedName;

	private StatusCategory statusCategory;

}
