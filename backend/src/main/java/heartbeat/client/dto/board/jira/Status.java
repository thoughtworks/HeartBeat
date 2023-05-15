package heartbeat.client.dto.board.jira;

import heartbeat.service.report.ICardFieldDisplayName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Status implements ICardFieldDisplayName {

	private String displayValue;

	public String getDisplayName() {
		return displayValue;
	}

}
