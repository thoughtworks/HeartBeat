package heartbeat.client.dto.board.jira;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class JiraBoardConfigDTO implements Serializable {

	private String id;

	private String name;

	private JiraColumnConfig columnConfig;

	@AllArgsConstructor
	@Data
	@Builder
	public static class AllDoneCardsResponseDTO implements Serializable {

		private String total;

		private List<DoneCard> issues;

	}

}
