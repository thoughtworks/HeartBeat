package heartbeat.controller.report.dto.response;

import heartbeat.client.dto.pipeline.buildkite.DeployInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeploymentFrequencyModel {

	private String name;

	private String step;

	private double value;

	private List<DeployInfo> passed;

}
