package heartbeat.handler.base;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum FIleType {

	ERROR("error", "error/"), REPORT("report", "report/"),
	METRICS_DATA_COMPLETED("metrics-data-completed", "metrics-data-completed/");

	private final String type;

	private final String path;

}
