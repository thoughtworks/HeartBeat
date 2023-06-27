package heartbeat.controller.report.dto.response;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AvgMeanTimeToRecovery {

	private final String name = "Average";

	private BigDecimal timeToRecovery;

}
