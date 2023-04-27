package heartbeat.client.dto.board.jira;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CardHistoryResponseDTO {

	private List<HistoryDetail> items;

}
