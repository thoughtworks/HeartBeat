package heartbeat.client.dto.board.jira;

import heartbeat.service.report.ICardFieldDisplayName;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

@JsonIgnoreProperties(ignoreUnknown = true)
public class Assignee implements ICardFieldDisplayName {

	private String displayName;

	public String getDisplayName() {
		return displayName;
	}

}
