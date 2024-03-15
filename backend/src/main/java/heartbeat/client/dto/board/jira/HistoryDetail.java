package heartbeat.client.dto.board.jira;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@AllArgsConstructor
public class HistoryDetail implements Serializable {

	private long timestamp;

	private String fieldId;

	private Status to;

	private Status from;

	private Actor actor;

	private String fieldDisplayName;

	@Getter
	@Setter
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	public static class Actor implements Serializable {

		private String displayName;

	}

}
