package heartbeat.client.dto.board.jira;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class HistoryDetail implements Serializable {

	private int timeStamp;

	private String fieldId;

	private Status to;

	private Status from;

}
