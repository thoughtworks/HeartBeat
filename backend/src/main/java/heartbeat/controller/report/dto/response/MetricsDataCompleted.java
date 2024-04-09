package heartbeat.controller.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Optional;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@EqualsAndHashCode
public class MetricsDataCompleted {

	private Boolean boardMetricsCompleted;

	private Boolean doraMetricsCompleted;

	private Boolean overallMetricCompleted;

	private Boolean isSuccessfulCreateCsvFile;

	public Boolean boardMetricsCompleted() {
		return boardMetricsCompleted;
	}

	public Boolean doraMetricsCompleted() {
		return doraMetricsCompleted;
	}

	public Boolean overallMetricCompleted() {
		return overallMetricCompleted;
	}

	public Boolean isSuccessfulCreateCsvFile() {
		return isSuccessfulCreateCsvFile;
	}

	public Boolean allMetricsCompleted() {
		return Optional.ofNullable(boardMetricsCompleted).orElse(true)
				&& Optional.ofNullable(doraMetricsCompleted).orElse(true) && overallMetricCompleted;
	}

}
