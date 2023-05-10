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
public class DeploymentFrequencyOfPipeline {

	private String name;

	private String step;

	private float deploymentFrequency;

	private List<DailyDeploymentCount> dailyDeploymentCounts;

}
