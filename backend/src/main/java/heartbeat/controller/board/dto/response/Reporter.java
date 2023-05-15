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
public class Reporter implements ICardFieldDisplayName {

	private String displayName;

	public String getDisplayName() {
		return displayName;
	}

}
