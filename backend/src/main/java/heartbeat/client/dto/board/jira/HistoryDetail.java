package heartbeat.client.dto.board.jira;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class HistoryDetail {

	private int timeStamp;

	private String fieldId;

	private Status to;

	private Status from;

}
