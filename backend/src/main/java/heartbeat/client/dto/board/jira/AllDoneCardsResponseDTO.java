package heartbeat.client.dto.board.jira;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@AllArgsConstructor
@Data
@Builder
public class AllDoneCardsResponseDTO {

	private String total;

	private List<JiraCard> issues;

}
