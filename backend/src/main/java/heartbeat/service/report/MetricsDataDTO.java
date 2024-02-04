package heartbeat.service.report;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class MetricsDataDTO {

	boolean isBoardReady;

	boolean isDoraReady;

	boolean isAllMetricsReady;

}
