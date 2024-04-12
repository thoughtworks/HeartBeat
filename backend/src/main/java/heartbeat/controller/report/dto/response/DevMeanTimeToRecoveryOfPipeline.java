package heartbeat.controller.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DevMeanTimeToRecoveryOfPipeline {

	private String name;

	private String step;

	private BigDecimal timeToRecovery;

}
