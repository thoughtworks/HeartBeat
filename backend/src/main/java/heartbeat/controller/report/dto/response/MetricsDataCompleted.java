package heartbeat.controller.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Objects;
import java.util.stream.Stream;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@EqualsAndHashCode
public class MetricsDataCompleted {

	private Boolean boardMetricsCompleted;

	private Boolean doraMetricsCompleted;

	public Boolean boardMetricsCompleted() {
		return boardMetricsCompleted;
	}

	public Boolean doraMetricsCompleted() {
		return doraMetricsCompleted;
	}

	public boolean isAllMetricsCompleted() {
		return Stream.of(boardMetricsCompleted, doraMetricsCompleted)
			.filter(Objects::nonNull)
			.allMatch(Boolean::booleanValue);
	}

}
