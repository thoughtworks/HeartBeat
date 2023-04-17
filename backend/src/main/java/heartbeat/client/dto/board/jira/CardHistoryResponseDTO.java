package heartbeat.client.dto.board.jira;

import java.io.Serializable;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CardHistoryResponseDTO implements Serializable {

	private List<HistoryDetail> items;

}
