package heartbeat.util;

import heartbeat.controller.report.dto.request.MetricEnum;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Stream;

@Getter
@RequiredArgsConstructor
public enum MetricsUtil {

	KANBAN_METRICS(Stream.of(MetricEnum.VELOCITY, MetricEnum.CYCLE_TIME, MetricEnum.CLASSIFICATION)
		.map(MetricEnum::getValue)
		.toList()),

	BUILDKITE_METRICS(
			Stream.of(MetricEnum.CHANGE_FAILURE_RATE, MetricEnum.DEPLOYMENT_FREQUENCY, MetricEnum.MEAN_TIME_TO_RECOVERY)
				.map(MetricEnum::getValue)
				.toList()),

	CODEBASE_METRICS(Stream.of(MetricEnum.LEAD_TIME_FOR_CHANGES).map(MetricEnum::getValue).toList());

	private final List<String> value;

}
