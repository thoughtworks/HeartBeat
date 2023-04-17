package heartbeat.controller.board.vo;

import heartbeat.controller.board.vo.response.CycleTimeInfo;
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
