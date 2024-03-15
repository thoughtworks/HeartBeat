package heartbeat.controller.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DevChangeFailureRateOfPipeline {

	private String name;

	private String step;

	private int failedTimesOfPipeline;

	private int totalTimesOfPipeline;

	private float failureRate;

}
