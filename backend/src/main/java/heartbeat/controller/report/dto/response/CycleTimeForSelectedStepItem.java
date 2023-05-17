package heartbeat.controller.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CycleTimeForSelectedStepItem {

	private String optionalItemName;

	private double averageTimeForSP;

	private double averageTimeForCards;

	private double totalTime;

}
