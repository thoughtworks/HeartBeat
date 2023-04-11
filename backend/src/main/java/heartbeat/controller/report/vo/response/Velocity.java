package heartbeat.controller.report.vo.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Velocity {

	private String velocityForSP;

	private String velocityForCards;

	private String percentageOfPlannedFeature;

	private String percentageOfPlannedOperation;

	private String percentageOfUnplannedOperation;

}
