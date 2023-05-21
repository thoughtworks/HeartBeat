package heartbeat.controller.board.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import heartbeat.service.report.ICardFieldDisplayName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

@JsonIgnoreProperties(ignoreUnknown = true)
public class Partner implements ICardFieldDisplayName {

	private String displayName;

	public String getDisplayName() {
		return displayName;
	}

}
