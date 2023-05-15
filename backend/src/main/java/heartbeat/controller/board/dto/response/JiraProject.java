package heartbeat.controller.board.dto.response;

import heartbeat.service.report.ICardFieldDisplayName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JiraProject implements ICardFieldDisplayName {

	private String id;

	private String key;

	private String name;

	public String getDisplayName() {
		return name;
	}

}
