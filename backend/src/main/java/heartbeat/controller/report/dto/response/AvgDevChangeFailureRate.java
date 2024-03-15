package heartbeat.controller.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvgDevChangeFailureRate {

	@Builder.Default
	private String name = "Average";

	private int totalTimes;

	private int totalFailedTimes;

	private float failureRate;

}
