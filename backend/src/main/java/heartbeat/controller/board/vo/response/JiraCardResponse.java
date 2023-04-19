package heartbeat.controller.board.vo.response;

import heartbeat.client.dto.JiraCard;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class JiraCardResponse {

	private JiraCard baseInfo;

	private List<CycleTimeInfo> cycleTime;

	private List<CycleTimeInfo> originCycleTime;

	private CardCycleTime cardCycleTime;

}
