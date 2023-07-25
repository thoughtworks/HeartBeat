package heartbeat.controller.board.dto.response;

import heartbeat.service.report.ICardFieldDisplayName;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

@JsonIgnoreProperties(ignoreUnknown = true)
public class CardParent implements ICardFieldDisplayName {

	private Fields fields;

	private String name;

	private String key;

	public String getDisplayName() {
		return key;
	}

}
