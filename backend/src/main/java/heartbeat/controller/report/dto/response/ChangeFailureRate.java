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
public class ChangeFailureRate {

	private AvgChangeFailureRate avgChangeFailureRate;

	private List<ChangeFailureRateOfPipeline> changeFailureRateOfPipelines;

}
