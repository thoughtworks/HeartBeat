package heartbeat.controller.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CycleTimeResult {

	private List<CycleTimeForSelectedStepItem> cycleTimeForSelectedStepsList;

	private double totalTime;

}
