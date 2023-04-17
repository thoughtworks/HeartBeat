package heartbeat.client.dto.board.jira;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@AllArgsConstructor
@Data
@Builder
public class AllDoneCardsResponseDTO implements Serializable {

	private String total;

	private List<DoneCard> issues;

}
