package heartbeat.controller.board.dto.response;

import heartbeat.controller.board.dto.response.CycleTimeInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CycleTimeInfoDTO {

	private List<CycleTimeInfo> cycleTimeInfos;

	private List<CycleTimeInfo> originCycleTimeInfos;

}
